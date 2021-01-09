# Python script demo

```python3 change_article_section.py --help```

Takes an input/CSV file containing article link and section numbers. Changes article existing section ID to new section ID. Can optionally add article labels.

Check script to make sure all imported Python packages are installed.

Password access to the account is needed (see `--username` option).

Subdomain is needed (see `--subdomain` option).

## 1. Input CSV needs these three columns

Columns need to be in this order:

`article_url`  (example: https://your_subdomain.zendesk.com/hc/en-us/articles/360005727130). This prefix

`new_section_id`  

`additional_labels` (_space_ separated label values)

See example_input.csv.

## 2. Use --dryrun option first
This validates the format and content of the CSV. Any issues are output to the console window.

For any article, section, or label that does not have the expected format (ex: numeric value for section ID), an error is output to the console.

For any article or section that does not exist in the given subdomain's Support instance, an error is output to the console.

Values are only checked; no article attributes are changed.

## 3. Use --move to make actual changes

This is the option that changes article section IDs.

Optionally, any space separated labels listed in the input CSV are applied to the given article.


### Example input CSV:
```
article_url, new_section_id, additional_labels
https://your_subdomain.zendesk.com/hc/en-us/articles/360005727130-Cherry-Apple,360012218210,
https://your_subdomain.zendesk.com/hc/en-us/articles/360005727135-Orange,360012218215, newlabel1
https://your_subdomain.zendesk.com/hc/en-us/articles/360005727140,360012218220,  newlabel_2 newlabel_3
```

### Output CSV:
All errors are output to the console.

All successful section changes are output to a CSV named `output_{current_time}.csv`

Output CSV contains previous values and new section ID and label values for each article.
```
article_url,old_section_id,new_section_id,old_label_set,new_label_set
https://your_subdomain.zendesk.com/hc/en-us/articles/360005727130-Cherry-Apple,1111111111,360012218210,,
https://your_subdomain.zendesk.com/hc/en-us/articles/360005727135-Orange,2222222222,360012218215,existing_labelA,existing_labelA newlabel1
https://your_subdomain.zendesk.com/hc/en-us/articles/360005727140,3333333333,360012218220,existing_labelB,existing_labelB newlabel_2 newlabel_3
```
