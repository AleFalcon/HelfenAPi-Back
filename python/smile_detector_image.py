import cv2
from keras.models import load_model
import numpy as np



width = 800
height = 600
blue = (255, 0, 0)

# load the image, resize it, and convert it to grayscale
image = cv2.imread("")
image = cv2.resize(image, (width, height))
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
# load the haar cascade face detector
face_detector = cv2.CascadeClassifier("haar_cascade/haarcascade_frontalface_default.xml")
# load our trained model
model = load_model("model")
label = False
# detect faces in the grayscale image
face_rects = face_detector.detectMultiScale(gray, 1.1, 8)
# loop over the face bounding boxes
for (x, y, w, h) in face_rects:
    cv2.rectangle(image, (x, y), (x + w, y + h), blue, 2)
    # extract the region of the face from the grayscale image
    roi = gray[y:y + h, x:x + w]
    roi = cv2.resize(roi, (32, 32))
    roi = roi / 255.0
    # add a new axis to the image
    # previous shape: (32, 32), new shape: (1, 32, 32)
    roi = roi[np.newaxis, ...]
    # apply the smile detector to the face roi
    prediction = model.predict(roi)[0]
    label = True if prediction >= 0.5 else False

print(label)