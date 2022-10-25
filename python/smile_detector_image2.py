import cv2
import sys

width = 600
height = 800
white = [255,255,255]

# load the image, resize it, and convert it to grayscale
image = cv2.imread(sys.argv[1])
image = cv2.resize(image, (width, height))
newimage= cv2.copyMakeBorder(image,0,0,60,60,cv2.BORDER_CONSTANT,value=white)
gray = cv2.cvtColor(newimage, cv2.COLOR_BGR2GRAY)
gray = cv2.bilateralFilter(gray,5,1,1)
# load the haar cascades face and smile detectors
face_detector = cv2.CascadeClassifier("python/haar_cascade/haarcascade_frontalface_default.xml")
smile_detector = cv2.CascadeClassifier("python/haar_cascade/haarcascade_smile.xml")

# detect faces in the grayscale image
face_rects = face_detector.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)
# loop over the face bounding boxes
result = False
for (x, y, w, h) in face_rects:
    # extract the face from the grayscale image
    roi = gray[y:y + h, x:x + w]

    # apply the smile detector to the face roi
    smile_rects, rejectLevels, levelWeights = smile_detector.detectMultiScale3(roi, 2.5, 20, outputRejectLevels=True)
    # if there was no detection, we consider this a "no smiling" detection
    if len(levelWeights) == 0:
        result = False
    else:
        # if `levelWeights` is below 2, we classify this as "Not Smiling"
        if max(levelWeights) < 2:
            result = False
        # otherwise, there is a smiling in the face ROI
        else:
            result = True

print(result)

