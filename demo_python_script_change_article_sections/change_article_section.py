#
# Readme:
#
# Input CSV file should have three columns:
#     article_url (example: https://your_subdomain.zendesk.com/hc/en-us/articles/12345678)
#     new_section_id
#     additional_labels (space separated)
#
# Help: python3 change_article_section.py -h
#

# Make sure these packages are installed.
import os
import csv
import re
import json
from requests import Request, Session
import time
import argparse

# Comand line arguments.
parser = argparse.ArgumentParser()
parser.add_argument('-i', '--inputfile', metavar='input_file', help='CSV file to process', nargs=1, required=True)
parser.add_argument('-s', '--subdomain', metavar='zendesk_subdomain', help='Zendesk Support subdomain', nargs=1, required=True)
parser.add_argument('-m', '--move', action='store_true', help='Perform changes')
parser.add_argument('-d', '--dryrun', action='store_true', help='Test - process file without making changes. Checks for valid CSV input')
parser.add_argument('-u', '--username', metavar='email:password', help='Used to make API calls', nargs=1, required=True)
args = parser.parse_args()


def is_input_file_valid(input_file):

  print('Checking that input file is valid...')

  # Does input file exist?
  if not os.path.isfile(input_file):
    print(f'Error: file {input_file} does not exist')
    return False

  # Does input file have proper headers? Check header names.
  #   Get first row and check header names.
  with open(input_file, mode='r') as csvfile:
      csv_reader = csv.reader(csvfile, delimiter=',', quoting=csv.QUOTE_MINIMAL, quotechar='"')
      first_row = next(csv_reader)
      if first_row[0].strip() != 'article_url' \
          or first_row[1].strip() != 'new_section_id' \
          or first_row[2].strip() != 'additional_labels':
        print(f'Error: file {input_file} does not have correct headers')
        return False

      # Are input file values correct? (URL, section ID, string of labels).
      #  First parameter: URL that contains article ID
      #  Second parameter: New section ID
      #  Third parameter: String of space separated strings of labels to add to the article.
      for row in csv_reader:
        # Need three values for each input row
        if len(row) != 3:
          print(f'Error: {row} needs three values')
          return False

        # Regex to see if valid articles URL. EXPECTED, that URL is the "UI" URL, *not* the "API URL".
        url_regex = re.compile(f'^https?://{args.subdomain[0]}.zendesk.com/hc/en-us/articles/[0-9]+')
        match = url_regex.search(row[0])
        if not match:
          print(f'Error: {row[0]} not a valid article URL (ex: https://your_subdomain.zendesk.com/hc/en-us/articles/123).')
          return False

        # Regex section ID is only number.
        url_regex = re.compile('^[0-9]+$')
        match = url_regex.search(row[1])
        if not match:
          print(f'Error: {row[1]} not a valid Section ID. Must be a number.')
          return False

        # Are given labels valid?
        new_labels = row[2].split()
        for label in new_labels:
          label_regex = re.compile('\w+')
          match = label_regex.search(label)
          if len(label) > 0 and not match:
            print(f'Error: invalid label "{label}" on {row[0]}.')
            return False

  return True


def do_dry_run(input_file, subdomain, username, password):

  print('Dry run: checking that articles and sections exist in ZD instance...')

  with open(input_file, mode='r') as csvfile:
      csv_reader = csv.reader(csvfile, delimiter=',', quoting=csv.QUOTE_MINIMAL, quotechar='"')
      
      # Get past header/column name row.
      first_row = next(csv_reader)

      row_number = 0
      dots = '.'

      sections_checked = set()

      s = Session()
      for row in csv_reader:
        row_number = row_number + 1

        # EXPECTED, that URL is the "UI" URL, *not* the "API URL", so convert it.
        article_url = row[0].replace('/hc/en-us/', '/api/v2/help_center/')
        new_section = row[1]
        new_labels = row[2].split()

        # Read URL - does it exist in instance?
        req = Request('GET', article_url, headers={'content-type': 'application/json'}, auth=(username, password))
        prepped = req.prepare()
        resp = s.send(prepped)
        if resp.status_code != 200:
          print(f'Error: status code {resp.status_code} getting {article_url}.')
        else:
          # Output warning that article's old seciton ID is same as new section ID
          json_data = json.loads(resp.text)
          article_section_id = json_data["article"]["section_id"]
          if article_section_id == new_section:
            print(f'Error: Article existing section_id same as new section id. Article: {article_url} Section: {new_section}.')

        if not (new_section in sections_checked):

          # Read section number - does it exist in instance?
          section_url = f'https://{subdomain}.zendesk.com/api/v2/help_center/sections/{new_section}'
          req = Request('GET', section_url, headers={'content-type': 'application/json'}, auth=(username, password))
          prepped = req.prepare()
          resp = s.send(prepped)
          if resp.status_code == 200:
            sections_checked.add(new_section)
          else:
            print(f'Error: status code {resp.status_code} getting section {section_url}.')

        # TODO: Avoid 429s

        print(dots)
        dots = dots + '.'

      print('Dry run: successful. CSV file format correct. Referenced articles and sections exist.')


def do_move(input_file, subdomain, username, password):
  
  print('Update section: change section IDs of articles...')

  # Output update actions to CSV file.
  ts = time.localtime()
  current_time = time.strftime("%Y%m%d_%H%M%S", ts)
  output_file_name = f'output_{current_time}.csv'
  output_file = open(output_file_name, 'w')
  writer = csv.writer(output_file)
  writer.writerow(["article_url", "old_section_id", "new_section_id", "old_label_set", "new_label_set"])

  with open(input_file, mode='r') as csvfile:
      csv_reader = csv.reader(csvfile, delimiter=',', quoting=csv.QUOTE_MINIMAL, quotechar='"')
      
      # Get past header/column name row.
      first_row = next(csv_reader)

      row_number = 0
      dots = '.'

      s = Session()
      for row in csv_reader:
        row_number = row_number + 1

        # EXPECTED, that URL is the "UI" URL, *not* the "API URL", so convert it.
        original_article_url = row[0]
        article_url = original_article_url.replace('/hc/en-us/', '/api/v2/help_center/')
        new_section = row[1]
        new_labels = row[2].split()
        existing_section_id = 0

        # Get current section ID.
        req = Request('GET', article_url, headers={'content-type': 'application/json'}, auth=(username, password))
        prepped = req.prepare()
        resp = s.send(prepped)
        if resp.status_code != 200:
          print(f'Error: Getting labels. Status code {resp.status_code} getting {label_url}.')
          print(resp.text)
          return
        else:
          json_data = json.loads(resp.text)
          existing_section_id = json_data["article"]["section_id"]

        # Update article's section ID.
        # Example article URL: https://z3n3395.zendesk.com/api/v2/help_center/articles/360005727134
        data = json.dumps({'section_id': new_section})
        req = Request('PUT', article_url, data=data, headers={'content-type': 'application/json'}, auth=(username, password))
        prepped = req.prepare()
        resp = s.send(prepped)
        if resp.status_code != 200:
          print(f'Error: status code {resp.status_code} updating {article_url}.')
          print(resp.text)
          return

        ############################
        # Update article's labels  #
        ############################

        # GET existing labels and add new labels — use 'set' to avoid duplicates.

        # Article labels can be updated using undocumented API.
        #   Convert https://z3n3395.zendesk.com/api/v2/help_center/articles/360005727134
        #     ...to https://z3n3395.zendesk.com/knowledge/api/articles/360005727134
        # ...and convert to "label update" URL by changing the middle part.
        label_url = article_url.replace('/api/v2/help_center/', '/knowledge/api/')

        # Get existing labels.
        existing_labels_for_csv = ''
        req = Request('GET', f'{label_url}?fields=labels', headers={'content-type': 'application/json'}, auth=(username, password))
        prepped = req.prepare()
        resp = s.send(prepped)
        if resp.status_code != 200:
          print(f'Error: Getting labels. Status code {resp.status_code} getting {label_url}.')
          print(resp.text)
          return
        else:
          # Add existing label set to new label set.
          json_data = json.loads(resp.text)
          existing_labels_for_csv = ' '.join(json_data["labels"])
          labels_set = set(json_data["labels"])
          labels_set = labels_set.union(new_labels)
          # Convert 'set' to 'array' that will be used in final update call.
          new_labels = list(labels_set)
          new_labels_for_csv = ' '.join(new_labels)

        # Update article labels.
        data = json.dumps({"labels": new_labels})
        req = Request('PUT', label_url, data=data, headers={'content-type': 'application/json'}, auth=(username, password))
        prepped = req.prepare()
        resp = s.send(prepped)
        if resp.status_code != 200:
          print(f'Error: Updating labels {new_labels}. Status code {resp.status_code} updating {label_url}.')
          print(resp.text)
          return

        print(dots)
        dots = dots + '.'

        writer.writerow([original_article_url, existing_section_id, new_section, existing_labels_for_csv, new_labels_for_csv])

        # TODO: Avoid 429s
      print(f'Move: successful. See output file {output_file_name} for details.')



def main():

  if (args.dryrun and args.move):
    print("Options '--dryrun' and '--move' are exclusive.")
    return

  if is_input_file_valid(args.inputfile[0]):
    print('Success: input CSV file is valid...')
  else:
    print('Error: input CSV file invalid.')
    return

  # Regex check username:password.
  username_regex = re.compile('\S+:\S+')
  match = username_regex.search(args.username[0])
  user_credentials = []
  if not match:
    print('Error: not a valid user credentials - need username:password')
    return
  else:
    user_credentials = args.username[0].split(":")

  # Run through input file.
  if args.dryrun:
    do_dry_run(args.inputfile[0], args.subdomain[0], user_credentials[0], user_credentials[1])
  elif args.move:
    do_move(args.inputfile[0], args.subdomain[0], user_credentials[0], user_credentials[1])
  else:
    print("Notice: no action taken. Use '--dryrun' or '--move'.")


main()
