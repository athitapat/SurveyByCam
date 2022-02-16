import easyocr 
import cv2
from exif import Image
import numpy as np
import os
import json
import sys
import requests
from apiKey import API_KEY

reader = easyocr.Reader(['th', 'en'])
boxing_path = ''
def saveResult(img_file, img, boxes, dirname='../backend/images/', verticals=None, texts=None):
        global boxing_path
        global bfname
        """ save text detection result one by one
        Args:
            img_file (str): image file name
            img (array): raw image context
            boxes (array): array of result file
                Shape: [num_detections, 4] for BB output / [num_detections, 4] for QUAD output
        Return:
            None
        """
        img = np.ascontiguousarray(img, dtype=np.uint8)
        #img = np.array(img)#

        # make result file list
        filename, file_ext = os.path.splitext(os.path.basename(img_file))

        # result directory
        res_file = dirname  + filename + '_boxing'+'.txt'
        res_img_file = dirname  + filename + '_boxing'+ '.jpg'
        boxing_path = res_img_file
        bfname = filename + '_boxing'+ '.jpg'

        if not os.path.isdir(dirname):
            os.mkdir(dirname)

    # with open(res_file, 'w') as f:
        for i, box in enumerate(boxes):
            poly = np.array(box).astype(np.int32).reshape((-1))
            strResult = ','.join([str(p) for p in poly]) + '\r\n'
            # f.write(strResult)

            poly = poly.reshape(-1, 2)
            cv2.polylines(img, [poly.reshape((-1, 1, 2))], True, color=(0, 0, 255), thickness=2)
            ptColor = (0, 255, 255)
            if verticals is not None:
                if verticals[i]:
                    ptColor = (255, 0, 0)

            if texts is not None:
                font = cv2.FONT_HERSHEY_SIMPLEX
                font_scale = 0.5
                cv2.putText(img, "{}".format(texts[i]), (poly[0][0]+1, poly[0][1]+1), font, font_scale, (0, 0, 0), thickness=1)
                cv2.putText(img, "{}".format(texts[i]), tuple(poly[0]), font, font_scale, (0, 255, 255), thickness=1)

        # Save result image
        cv2.imwrite(res_img_file, img)

def Deg2Dec(deg_form: tuple, ref):
    res = deg_form[0] + deg_form[1]/60 + deg_form[2]/3600
    if ref == 'N' or ref =='E':
        return  res
    else:
        return -1*res


img_file = str(sys.argv[1])
# print(img_file)
path =  img_file#input("image_Path: ")
fname = img_file.strip().split("\\")
fname = fname[-1]


information = reader.readtext(path)
boxes = [i[0] for i in information]
texts = [(i[1], i[2]) for i in information]
raw_text = ''
for i in information:
    raw_text += i[1] + " "

img = cv2.imread(path)
saveResult(img_file ,img, boxes)
# print(img_file + "\n") 

with open(path, 'rb') as image_file:
    my_image = Image(image_file)

lat = Deg2Dec(my_image.gps_latitude,my_image.gps_latitude_ref)
lng = Deg2Dec(my_image.gps_longitude,my_image.gps_longitude_ref)
address = requests.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+ str(lat)+','+ str(lng)+ '&key='+ API_KEY).json()
address = address['results'][0]['formatted_address']

position = {
    "latitude": lat,
    "latitude_deg": my_image.gps_latitude,
    "longitude": lng,
    "longitude_deg": my_image.gps_longitude
}

resp = {
    "image_path": "/images/"+ fname,#img_file,
    "boxing_path": "/images/"+ bfname, #boxing_path,
    "dimention": (my_image.pixel_x_dimension, my_image.pixel_y_dimension),
    "position": position,
    "address": address,
    "raw_text": raw_text,
    "texts": texts,
    "date_taken": my_image.datetime_original,
    "date_saved": ''
}

print(json.dumps(resp))

