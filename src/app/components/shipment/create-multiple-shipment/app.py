f = open('upload.csv', 'w')
lc = ['ORDREF', 'RName', 'RAdd1', 'RAdd2', 'RPostCode',
'RCity', 'RState', 'RCountry', 'RContactName', 'RContactNumber', 
'RContactEmail', 'QTY', 'COD', 'CommodityDesc', 'CommodityValue', 
'PackingType']
c = ','.join(lc)
f.write(c)
f.write('\n')

for i in range(1, 601):
    s = 'Ord0{0}'.format(str(i).zfill(4))
    ls = [s, 'James', "No1A, Jalan Permatang 22, Taman Desa Jaya", 'Industrial Park', '47400',
    'JOHOR BAHRU', 'JOHOR', 'Malaysia', '', '192676802',
    'me@gmail.com', '2', '0', 'Gift Box', '10',
    'PAR']
    v = ','.join(ls)
    f.write(v)
    f.write('\n')

f.close()