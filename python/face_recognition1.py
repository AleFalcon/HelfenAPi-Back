import face_recognition
import sys

    # Load the jpg files into numpy arrays
camera_image = face_recognition.load_image_file(sys.argv[1])
dni_image = face_recognition.load_image_file(sys.argv[2])
# Get the face encodings for each face in each image file
# Since there could be more than one face in each image, it returns a list of encodings.
# But since I know each image only has one face, I only care about the first encoding in each image, so I grab index 0.
try:
    camera_face_encoding = face_recognition.face_encodings(camera_image)[0]
    dni_face_encoding = face_recognition.face_encodings(dni_image)[0]
except IndexError:
    print("I wasn't able to locate any faces in at least one of the images. Check the image files. Aborting...")
    quit()
known_faces = [
    camera_face_encoding
]
# results is an array of True/False telling if the dni face matched anyone in the known_faces array
results = face_recognition.compare_faces(known_faces, dni_face_encoding)
#print("Is the dni face a picture of camera? {}".format(results[0]))
print(results[0])
#print("Is the dni face a new person that we've never seen before? {}".format(not True in results))