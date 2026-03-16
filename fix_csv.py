# -*- coding: utf-8 -*-
import csv
import os

desktop = os.path.join(os.path.expanduser('~'), 'Desktop')
path_in = os.path.join(desktop, '2170125966481817668-ee8c91b2-0dc1-4a52-aecf-e913098b1050.csv')

with open(path_in, 'r', encoding='utf-8') as f:
    rows = list(csv.reader(f))

with open(path_in, 'w', encoding='utf-8-sig', newline='') as f:
    w = csv.writer(f, delimiter=';')
    w.writerows(rows)

print('Done. Rows:', len(rows))
