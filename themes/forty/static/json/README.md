# Formatting a Walkthrough Tutorial in JSON
All tutorials for this site will work via a JSON blob with many states. The user will click "next" and "back" buttons that will navigate from one state to the next. Each state will contain a title, some text, and either an image or plot info.

The backend will determine whether the state has an image or a plot and will display the information accordingly. 

## Fields
### Required Fields
Each state must have the following fields in the following formats.
- `title` (string)
- `text` (list of strings)
    - Text must be a list of strings. Each list of items represents a new paragraph. The text item must contain at least one element, and it can be an empty string if there is nothing to display
- `format` (string)
    - Either `"plot"`, `"image"` or `"none"`.

### Optional Fields
- `plot` (dictionary)
    - If you are creating a plot, include a `plot` key with a JSON dict value. This dictionary must have the following fields.
    - `traces`: (list of dicts)
        - These are the trace objects used by Plotly to generate the plot. Here is the [full reference](https://plotly.com/javascript/reference/) on creating trace objects, and here are some [examples](https://plotly.com/javascript/basic-charts/).
    - `layout`: (dict)
        - This is the JSON object that Plotly will use to determine the visual formatting of the plot. Here is the [full reference](https://plotly.com/javascript/reference/layout/) on creating a layout. 

- `img` (dictionary)
    - If you want to render an image, supply an img dict to the state. This will need the following fields.
    - `path`: (string)
        - Required field, path pointing to the image you are rendering. 
    - `style`: (string)
        - Optional field, string containing CSS for the image. If none is provided, the image will simply fill the standard div where the images and plots are shown.
