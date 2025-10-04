import tensorflow as tf
import numpy as np


# Downloading and Loading the Dataset
fashion_mnist = tf.keras.datasets.fashion_mnist
(training_x, training_y), (test_x, test_y) = fashion_mnist.load_data()

class_names = ['T-Shirt', 'Pants', 'Pullover', 'Dress', 'Coat', 'Sandal', 'Shirt', 'Sneaker', 'Bag', 'Ankle Boot']

# Creating the model

training_x = training_x / 255.0
test_x = test_x / 255.0

# Model (dense + dropout)
model = tf.keras.Sequential([
    tf.keras.layers.Flatten(input_shape=(28,28)),
    tf.keras.layers.Dense(256, activation='relu'),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(10, activation='softmax')
])

model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
              loss=tf.keras.losses.SparseCategoricalCrossentropy(),
              metrics=['accuracy'])

# Training the model
model.fit(training_x, training_y, epochs=10, batch_size=128, validation_split=0.1)
model.save("DetectionModel.keras")

# Testing the model
test_loss, test_acc = model.evaluate(test_x,  test_y, verbose=0)
print('\nTest accuracy: %.2f%%' % (test_acc * 100))


