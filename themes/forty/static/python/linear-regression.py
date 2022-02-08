import js
import pyodide
import random
import numpy as np
from js import Plotly


SLOPE = 2
TRAINING_C = 25
ERROR_SCALE = 50
ERROR_SAMPLE = [float(x) / 10.0 for x in random.sample(range(-ERROR_SCALE, ERROR_SCALE), 10)]
TRAIN_X = [float(x) / 10.0 for x in random.sample(range(-50, 50), TRAINING_C)]
TRAIN_Y = [(x * SLOPE) + random.choice(ERROR_SAMPLE) for x in TRAIN_X]

print("IN PYTHON")

def updatePoints():
    global SLOPE
    global TRAINING_C
    global TRAIN_X
    global TRAIN_Y
    global ERROR_SAMPLE
    print("in python update")
    print(SLOPE)
    TRAIN_X = [float(x) / 10.0 for x in random.sample(range(-50, 50), TRAINING_C)]
    TRAIN_Y = [(x * SLOPE) + random.choice(ERROR_SAMPLE) for x in TRAIN_X]
    

def newSlope(_):
    global SLOPE
    SLOPE = float(js.document.getElementById('trueSlope').value)
    updatePoints()

def newTrainCount(_):
    global TRAINING_C
    TRAINING_C = int(js.document.getElementById('trainSize').value)
    updatePoints()

def newErr(_):
    global ERROR_SCALE
    global ERROR_SAMPLE
    ERROR_SCALE = int(js.document.getElementById('errorScale').value)
    ERROR_SAMPLE = [float(x) / 10.0 for x in random.sample(range(-ERROR_SCALE, ERROR_SCALE), 10)]
    updatePoints()



#updatePoints()

js.document.getElementById('trueSlope').onchange = newSlope
js.document.getElementById('trainSize').onchange = newTrainCount
js.document.getElementById('errorScale').onchange = newErr




