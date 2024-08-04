# How to create Survey Bots using Flormily<>Flowise : BHASAI

## Formily: Form Builder Dashboard

Lets have a look at the dashboard<br>
![](./assets/dashboard.png#pic)

### Components Pane:

    It contains the different types of fields. Currently we are supporting only `Input`, `Select`, `Upload` fields.

### Form Building Area (Drag and Drop area):

#### Design area

    In this area we drag and drop fields from the Components Pane.

#### Formily JSON schema:

    It shows the json schema of the fields along with their properties that are present in the design area.

#### React Component:

    It provides the react component for the form that is created in the design area.

#### Form Preview:

    It shows how the form will be present actually when the react component of the created form is used.

### Property Settings Pane:

    It helps in setting the required properties to the selected field or the whole form.
    We will be using it to set properties of a selected field.

For that

- First select a field.
- Then change properties like
  - Title
  - Name
  - Description
  - Required
  - Options (in case of `Select` Field)
  - Reactions
  - select Validators.

## Creating fields in the Form Builder

Lets see creating fields in the Form Builder

### `Input` Field:

After Dragging and Dropping the Input field component, it would look like this.
![](./assets/input_1.png#pic)

#### Input Field Properties

Lets briefly know about the different properties for the input field:

- `Name`: This field is will help you provide a key to the input field. The input that the user will provide will be mapped with this key.<br>
  **NOTE: Each field of the form should have unique `name`** <br>
  If not provided the user's input will be mapped to a random unique ID.
- `Title`: This will change the input field label. By default Title is _"Input"_.
- `Description`: Write a good description about what you are expecting the user to input. **These descriptions will be the Questions that your survey bot will ask the user>**
- `Display State`: You can use it to hide any field if you dont want to ask that question in the survey. It has 4 options.
  - `Inherit` and `Visible`: Will keep the question visible and that would be asked to the user.
  - `Hidden` and `None` : Will remove the question from the form builder and it won't be asked as a question to the user.
- `Reactions`: This will be used in case of Decision based forms. It is mostly used corresponding to a `Select` field, but can be used with `Input` in some cases. We will get into Reactions in the [How to create Decision based Forms](#how-to-create-decision-based-forms) section.
- `Validators`: It is used to add validations to the field. There are somewhat 10 different validators present in the list, but only 5 are functional currently, they are `url`, `email`, `number` (whole numbers), `phone` (for phone numbers, only Indian numbers), `llm`.
- `Required`: Its very evident from its name.
  <br>
  ![Input field After setting Properties](./assets/input_2.png#pic)

### `Select` Field:

After Dragging and Dropping the Select field component, it would look like this.<br>
![](./assets/select_1.png#pic)

#### Select Field Properties

Lets briefly know about the different properties for the select field:

- `Name`: This field is will help you provide a key to the select field. The input that the user will provide will be mapped with this key.<br>
  **NOTE: Each field of the form should have unique `name`** <br>
  If not provided the user's selection will be mapped to a random unique ID.
- `Title`: This will change the selection field label. By default Title is _"Select"_.
- `Description`: Write a good description about what you are expecting the user to select. **These descriptions will be the Questions that your survey bot will ask the user>**
- `Display State`: You can use it to hide any field if you dont want to ask that question in the survey. It has 4 options.
  - `Inherit` and `Visible`: Will keep the question visible and that would be asked to the user.
  - `Hidden` and `None` : Will remove the question from the form builder and it won't be asked as a question to the user.
- `Options`: It helps to add options to the select field. See this picture to get an idea of how Options are configured.<br>
  ![Configuring Options](./assets/options.png#pic)<br>
  You have to use the `Add Node` button to add a new option (or Node). And then edit the `value` property of the two fields in the right side.
- `Reactions`: This will be used in case of Decision based forms. It is mostly used corresponding to a `Select` field, but can be used with `Input` in some cases. We will get into Reactions in the [How to create Decision based Forms](#how-to-create-decision-based-forms) section.
- `Validators`: There is no use of validators for Select type fields.
- `Required`: There is no use of Required field for Select type fields as _Select fields are always required_.

![Select field Properties](./assets/select_3.png#pic)
![Input field After setting Properties](./assets/select_2.png#pic)

<!-- ### `Upload` Field:  -->
<!-- To be added -->

## How to create Decision Based Forms

Lets consider this example.

> You have a select field (Class) with options (Class 1 and Class 2). If `Class 1` is selected I will ask the user to write `marks of UKG`. And if `Class 2` is selected I will ask the user to write `marks of Class 1`.

1. Create the "class" (select) field.<br>
   ![](./assets/select_3.png#pic)<br>
   ![](./assets/options.png#pic)<br>
2. Create the two input fields.<br>
   ![](./assets/decision_1.png#pic)<br>
3. Configure the Reactions for each Input field.
   - Select the Input Fields one by one and click on the `Reactions`.
   - Set the Reactions

## ⭐ Logic Behind `Reactions` ⭐

Lets see the actual logic behind setting the reactions.

**Reactions are basically made so that the selected Field may react to the inputs given to the previous inputs by the user.**

Here I will only show the Reactions that is needed for making Decision based forms
See this picture<br>
![Configuring Reactions](./assets/reactions.png#pic)

> `Associated Fields`:<br>
>
> > At allows to select the associated fields our reactions would depend upon.<br>
> > Here I have chosen 'Class' and field property 'value' which means I have some dependencies which depends on the _value_ property of field with _title_ 'Class'. <br>
> > If you remember properly, 'Class' was a select field, having two nodes in _options_. And we had set two _label_s and \_value_s there. The Values were "Class 1" and "Class 2".<br>
> > The `Variable Name` => `$deps | class` indicates that we have to use `$deps.class` to access the \_value_ selected by the user for the field `Class`<br> > > **NOTE: "class" coming in `$deps` is actually the _Name_ we set to the field. If _Name_ was not set then we will get a random Unique ID in place "class" in `$deps`**

> `Property Reactions`:<br>
>
> > It is used to select the type of reaction. No need to go deep in the different types, we will always select the `Show/None` option (which is also by default).<br>
> > We have to pass a `boolean expression` in this part. Like its written<br> > > `$deps.class == "Class 1"`<br>
> > If this expression resulted in `true` then the selected input field ("Marks of UKG" in this case) will be visible.<br>
> > Hence "Marks of UKG" input field will only be visible if we select "Class 1" in the "Class" select field.

Similarly for "Marks of Class 1" input field we will set the reaction as `$deps.class == "Class 2"`.

Hope, this makes it clear how to create `Decision Based Forms`. Lets see how it works in the `Preview Pane`

<video src="./assets/decision_video.mp4" controls></video>

## How to get the bot ready for survey?

Here we have two ways for that:

1. Get the flowise JSON by clicking `SAVE` button on the nav bar. And use the Admin Dashboard.
2. Click on the `PUBLISH` button.

### Demo Video

<video src="./assets/demo.mp4" controls>Demo Video</video>

<style>
  img[src$="#pic"]{
      text-align: center;
      width: 70%;
    }
  @media only screen and (max-width: 960px){
    img[src$="#pic"]{
      text-align: center;
      width: 100%;
    }
  }
</style>
