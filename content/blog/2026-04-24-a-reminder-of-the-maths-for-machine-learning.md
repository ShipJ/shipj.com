---
id: '26'
title: A reminder of the maths for machine learning
meta_title: >-
  Essential Maths for Machine Learning: A Guide to Linear Algebra, Calculus, and
  Probability
description: >-
  The article "A reminder of the maths for machine learning" provides an
  overview of essential mathematical concepts required for machine learning,
  focusing on Linear Algebra, Calculus, and Probability and Statistics. It
  explains foundational topics such as vectors, matrices, derivatives, and the
  importance of optimization in model training. The article emphasizes the role
  of these mathematical principles in understanding and applying machine
  learning algorithms effectively.
slug: a-reminder-of-the-maths-for-machine-learning
date: '2026-04-24T15:14:50.102Z'
categories:
  - Data Science
tags:
  - machine-learning
  - maths
  - stats
  - interviews
author: Jack
length: Very Short (1-2 days)
read_time: 5
type: blog
draft: false
notion_id: 31b7fd6b-fd0d-8055-9af9-e28d0f7fef92
created_at: '2026-03-06T10:16:00.000Z'
last_edited_at: '2026-04-18T10:27:00.000Z'
last_synced: '2026-04-24T15:14:50.102Z'
math: true
image: ''
---
Here we’ll review basic concepts in Linear Algebra, Calculus, and Probability and Statistics to remind ourselves of the necessary ML pre-requisites.

Side note  - we’ll see just how useful enabling $\text{\LaTeX}$ was! See more in [How I created this site with Hugo](hugo-ref:portfolio/2026-04-24-how-i-created-this-site-with-hugo.md) 

## 1. Linear Algebra

This is the branch of mathematics that studies **linear objects** like vectors and matrices, and** linear transformations** between them.

A function $f(x)$ is linear if it satisfies

- **Additivity**: $f(x+y) = f(x) + f(y)$

- **Homogeneity: ****$f(\alpha x)=\alpha f(x)$**

If both hold, it is derived: $f(\alpha x + \beta y) = \alpha f(x) + \beta f(y)$



A **scalar** is a** numerical **quantity with **magnitude**. There is no concept of **direction **or** structure. **It is **0-dimensional** as there are no axes in which it varies - it *is* one value.

- Typically real numbers $r\in\R$ or integers $z\in\Z$. E.g $5, 3.14, -2$. In ML, they might represent features like $20(\degree\text{C})$ or $70(kg)$

- In `numpy`, we can initialise a scalar as: `x = np.array(5)` .



A **vector **is an ordered list of numbers, or a **1-dimensional** array of **scalars**, and there is a concept of magnitude *and ***direction.** Suppose our input contains 3 features: *temperature,* *weight, *and *age.* This can be represented as the column vector $v = \begin{bmatrix}
   20\\70\\28
\end{bmatrix}$. We say the **shape** of this vector is (3, 1). 

- We 

- E.g $v\in\R^3$

A matrix is a **2-dimensional** array of scalars arranged into rows and columns - think of it as a spreadsheet e.g $m = \begin{bmatrix}
   temp&weight&age\\20&70&28\\21&72&31\\22&69&29
\end{bmatrix}$



Note that an **array** is the fundamental data structure we use to build a structured collection of elements arranged along zero or more axes, where elements can be accessed using indices. This will be important in python!

An array has a property called **shape** that is used to describe how many elements exist in each dimension of the data structure. Typically, the first 

Be *very* careful about the shape of your **vectors **and** matrices.** This is important in ML as many operations performed on these data structures rely on. Vectors with shape (3, 1) and (1, 3).

Typically **rows** denote our observations, sometimes called **samples**, while **columns** represent features of our data.

A **tensor **is a logical extension of scalars, vectors and matrices to higher dimensions. Important in deep learning!



ℹ️  $Scalar \subset Vector \subset Matrix \subset Tensor$

- This makes sense intuitively if you think about single values < list of values < table of values < multiple tables of values

- In python



As with scalars, we can perform **operations** on vectors and matrices:

- Vectors are **added** element-wise. To do so they must have the same **dimension.**

- Vectors can be **multiplied** by a scalar, which we say **scales** the vector, e.g:

- The **dot-product**, denoted $v_1\cdot v_2$** **essentially measures how much two vectors point in the same direction and outputs a scalar.

The dot-product is a specific case of an **inner product** denoted $\langle v_1, v_2 \rangle$, that generalises the operation from euclidean spaces into more abstract spaces.

- The **norm** of a vector denoted $\lvert\lvert v_1 \rvert\rvert$ measures the size or length of a vector ignoring direction. We often think of this as being the geometric distance from the origin, but other measures of distance exist, e.g:



The **identity matrix** is equivalent to the number 1 in multiplication, such that: $AI = IA = A$ for any **compatible** matrix A

- By **compatible, **we mean the shape of the object allows the operation to be performed.

The **inverse** of a square matrix $A$ is a **square** matrix $A^{-1}$ such that $AA^{-1} = I$. Intuitively $A^{-1}$ reverses whatever transformation $A$ applies. In ML, computing the inverse can be computationally challenging. If you think about it, due to their shape, only square matrices can have an inverse.

Determinant

Trace

Eigenvalues



These **structures,** **operations** and **concepts **form the core linear algebra seen in ML and will surface repeatedly in ML!

## 2. Calculus

A **derivative** measures how a function changes as its input changes. Geometrically it represents the **slope** of the **tangent line** to the function at a point.

- E.g if $f(x) = x^2, f'(x) = 2x$. At $x=3, f'(x) = 6$ meaning the function increases at a rate of 6 near that point.

- To calculate a derivative of a function, we typically use one of the following rules depending on its structure:

- There are some standard results to memorise:

In ML, derivatives are used to **optimise **models - they tell us in which direction we need to move to **min**/**maximise** (often by gradient descent) to reduce **loss**. 



An **integral** measures the accumulation of a quantity

- E.g for a function $f(x)$, the integral $\int_{a}^{b}f(x)dx$ represents the area under the curve between a and b. If f(x) represents speed, then the integral represents distance traveled. 



Derivatives and Integrals are fundamental theorem of calculus, that states

A **gradient** is a generalisation of derivatives to functions with multiple variables - they are essential in training ML models, to minimise a loss function.

A **hessian **is 

The chain rule

- Backpropagation step is essentially repeated application of the chain rule through multiple layers



**Optimisation** means finding the value of parameters that **minimises** or **maximises** some function.

**Convex** optimisation problems require the feasible region to be convex. They have the property that any local minimum is the global minimum and so we don’t get trapped in sub-optimal solutions.

Many classical ML algorithms are convex optimisaton problems, including **linear regression**, which minimises the squared error

- $\min_\beta \lvert\lvert X\beta - y\rvert\rvert^2$

Or with logistic regression that minimises

- $\sum log(1 + e^{-y_i x_i^Tw})$

Deep learning models are usually **non-convex**, with many local minima and saddle points, but gradient based methods still apply.



## 3. Probability & Statistics

The **Expectation** (expected value, long-run mean) of a random variable is the average value if you repeated an experiment many times.

**Discrete**

- $E[X] = \sum_{x} x\cdot P(X=x)$, i.e multiply each value by its probability. For a dice (1 x 1/6 + 2 * 1/6 + … + 6 * 1/6) = 3.5

**Continuous**

- $E[X] = \int_{-\infty}^{\infty} x f(x)\,dx$, i.e integrate 



## 4. Machine Learning

A **dataset** typically comprises **features** (inputs) and a **target** (output). 

A **model **is a function that maps inputs to predictions $\hat{y} = f(x;\theta)$

- $x$ = input features

- $\theta$ = parameters

- $\hat{y}$ = prediction

The goal of **learning** is to find parameters $\theta$ that make predictions accurate, and we do this by minimising prediction error on the **training dataset**.

- $\theta^* = argmin_\theta L(\theta)$ where L is a **loss function**

A **loss function** measures how wrong the predictions are, e.g:

- Mean squared error

- MAPE

- Cross-entropy

When we talk about **optimisation**, we specifically mean the process of arriving at minimal loss. **Learning** is the broader term of applying such results on unseen data.

Most ML algorithms do this using **gradient-descent:**

- $\theta \leftarrow \theta - \alpha \Delta L(\theta)$ 

- $\alpha$: learning rate

- $\Delta L$: gradient of the loss



Datasets are split into **train** and **test** sets, where **train** is used to fit the model, while the **test** set is used to evaluate performance on unseen data to measure **generalisability**.



During modelling, we might encounter models that **overfit:**

- It models the training data *too* closely, including noise, often resulting in very low training set error, but high test set error

Alternatively we might find a model that **underfits**:

- It is too simple to capture relationships in the data, often resulting in high training and test set error



 An extension to the above is using a **validation** set, where an additional stage is used to tune hyperparameters. These are model-specific settings chosen before training like the **learning rate, regularisation strength, number of trees, network structure.** These are not learned, but set by us.



**Regularisation **helps address overfitting by discouraging overly complex models

- The L1 norm (used in LASSO regression) encourages sparsity. By this, we mean our model may choose fewer features. 

- The L2 norm (used in Ridge regression) shrinks parameters, resulting in smaller choices of parameters



**Occam’s Razor** is an important concept that essentially boils down to choosing the simpler choice. 



**Supervised** learning: the data has labels

**Unsupervised **learning**: **must discover the structure of the data



**Bias** / **Variance** tradeoff

At a given point, the expected squared prediction error is given by: $E[(y-\hat{f}(x)^2] = Bias^2 + Variance + Noise$

**Bias**

- $Bias(x)=E[\hat{f}^​(x)]−f(x)]$

- Measures the **systematic error** of the model's average prediction.

- If we trained the model many times on different datasets, how far would the average prediction be from the true function?

- High bias means the model **consistently misses the true relationship, **e.g trying to fit a straight line through **$y=x^2$**

- Error from overly simple models, 

**Variance**: 

- $Var(\hat{f}^​(x))=E[(\hat{f}^​(x)−E[\hat{f}^​(x)])^2]$

- Measures how much the model's predictions **change across different training datasets**

- If we train the model on different samples of data, how much do the predictions change

- High variance means the model is **very sensitive to the specific dataset used**.

**Noise:**

- irreducible randomness in real data. 

- Even perfect models can’t eliminate noise. 

- It represents measurement error, inherent randomness, variables unaccounted for

Simple models often have high bias, complex models have high variance



An **optimal model **has** low enough** bias to capture the pattern, but also **low enough** variance to generalise well.



Singular Value Decomposition (SVD), preprocessing step, remove collinearity



Principal Components Analysis (PCA) - essentially an application of SVD!

-
