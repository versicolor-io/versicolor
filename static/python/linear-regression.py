import js
import pyodide
import random
import numpy as np
from js import Plotly
from sklearn.linear_model import LinearRegression


SLOPE = 2
TRAINING_C = 10
STD_DEV = 3
ERROR_SAMPLE = [float(x) / 10.0 for x in np.random.normal(0, STD_DEV, size=TRAINING_C)]
TRAIN_X = [float(x) / 10.0 for x in random.sample(range(-50, 50), TRAINING_C)]
TRAIN_Y = [(x * SLOPE) + random.choice(ERROR_SAMPLE) for x in TRAIN_X]



def lineFit():
    global TRAIN_X
    global TRAIN_Y
    x = np.array(TRAIN_X).reshape((-1, 1))
    y = np.array(TRAIN_Y)

    model = LinearRegression().fit(x, y)
    return (model.intercept_, model.coef_, model.score(x,y))

FIT_INTERCEPT, FIT_SLOPE, R_SQ = lineFit()

def updatePoints():
    global SLOPE
    global TRAINING_C
    global TRAIN_X
    global TRAIN_Y
    global ERROR_SAMPLE
    global FIT_INTERCEPT
    global FIT_SLOPE
    global R_SQ
    TRAIN_X = [float(x) / 10.0 for x in random.sample(range(-50, 50), TRAINING_C)]
    TRAIN_Y = [(x * SLOPE) + random.choice(ERROR_SAMPLE) for x in TRAIN_X]
    FIT_INTERCEPT, FIT_SLOPE, R_SQ = lineFit()
    

def newSlope(_):
    global SLOPE
    SLOPE = float(js.document.getElementById('trueSlope').value)
    updatePoints()

def newTrainCount(_):
    global TRAINING_C
    TRAINING_C = int(js.document.getElementById('trainSize').value)
    updatePoints()

def newErr(_):
    global STD_DEV
    global ERROR_SAMPLE
    STD_DEV = float(js.document.getElementById('stdDev').value)
    ERROR_SAMPLE = [float(x) for x in np.random.normal(0, STD_DEV, size=TRAINING_C)]
    print(STD_DEV)
    print(ERROR_SAMPLE)
    updatePoints()



#updatePoints()

js.document.getElementById('trueSlope').onchange = newSlope
js.document.getElementById('trainSize').onchange = newTrainCount
js.document.getElementById('stdDev').onchange = newErr




