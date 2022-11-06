import cv2
import sys

width = 800
height = 600
white = [255,255,255]

# load the image, resize it, and convert it to grayscale
image = cv2.imread(sys.argv[1])
image = cv2.resize(image, (width, height))
#newimage= cv2.copyMakeBorder(image,0,0,50,50,cv2.BORDER_CONSTANT,value=white)
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
# load the haar cascades face and smile detectors
face_detector = cv2.CascadeClassifier("python/haar_cascade/haarcascade_frontalface_default.xml")
eye_detector = cv2.CascadeClassifier("python/haar_cascade/haarcascade_eye.xml")

# detect faces in the grayscale image
face_rects = face_detector.detectMultiScale(gray, 1.1, 8)
# loop over the face bounding boxes
result = False
for (x, y, w, h) in face_rects:
    # extract the face from the grayscale image
    roi = gray[y:y + h, x:x + w]

    # apply the smile detector to the face roi
    eye_rect = eye_detector.detectMultiScale(roi,
                                            scaleFactor = 1.2,
                                            minNeighbors = 5)
    # if there was no detection, we consider this a "no eye" detection
    if len(eye_rect) == 0:
        result = True
    else:
        # solo se detecta un ojo por lo que se entiende que la persona esta guiñando"
        if len(eye_rect) == 1:
            result = False
        # otherwise, tiene los ojos abiertos
        else:
            result = False

print(result)