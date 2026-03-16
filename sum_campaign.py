# -*- coding: utf-8 -*-
data = open('parse_campaign.txt').read().strip().split('\n')
sent = opens = c1 = c2 = c3 = 0
for line in data:
    parts = line.split()
    if len(parts) >= 6:
        sent += int(parts[0])
        opens += int(parts[2])
        c1 += int(parts[3])
        c2 += int(parts[4])
        c3 += int(parts[5])
print('Отправлено (delivered):', sent)
print('Открытия (opens):', opens)
print('Open rate: {:.2f}%'.format(100*opens/sent if sent else 0))
print('Клики тип 1:', c1)
print('Клики тип 2:', c2)
print('Клики тип 3:', c3)
print('Всего кликов:', c1+c2+c3)
