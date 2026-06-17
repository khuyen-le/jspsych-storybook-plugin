import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from "jspsych";

import { version } from "../package.json";

const info = <const>{
  name: "plugin-storybook",
  version: version,
  parameters: {
    
    /** Background image file path. */
    background_image : {
      type: ParameterType.STRING,
      default: undefined,
    },

    /** The width of the background image in percentage. */
    width: {
      type: ParameterType.INT,
      default: null,
    },

    /** The height of the background image in percentage. */
    height: {
      type: ParameterType.INT,
      default: null,
    },

    /** An array of objects. Each object represents an image that appears on the screen. Each object contains a id, src, clickable, x_pos, y_pos, width, height, time_onset, and time_offset parameter that will be applied to the question. */
    images: {
      type: ParameterType.COMPLEX,
      array: true,
      nested: {
        /** unique ID for this image. This must not have any spaces or special characters. */
        id: {
          type: ParameterType.STRING,
          default: undefined,
        },

        /** The path of the image file to be displayed.  */
        src: {
          type: ParameterType.STRING,
          default: undefined,
        },

        /** Whether the image is clickable. */
        clickable: {
          type: ParameterType.BOOL,
          default: false,
        },

        /** The x position of the image on the screen in percentage. */
        x_pos : {
          type: ParameterType.INT,
          default: 0
        }, 

        /** The y position of the image on the screen in percentage. */
        y_pos : {
          type: ParameterType.INT,
          default: 0
        }, 

        /** The width of the image in percentage. */
        width : {
          type: ParameterType.INT,
          default: null
        },

        /** The height of the image in percentage. */
        height : {
          type: ParameterType.INT,
          default: null
        },

        /** The time in milliseconds when the image should appear on the screen. */
        time_onset : {
          type: ParameterType.INT,
          default: 0
        }, 

        /** The time in milliseconds when the image should be removed from the screen. If null, the image will remain on the screen till trial ends*/
        duration : {
          type: ParameterType.INT,
          default: null
        }, 
        
        
      },
    },

    /** An array of objects. Each object represents an image that will be highlighted with a border. Each object contains an image_id parameter that corresponds to the ID of one of the images in the images array. */
    highlight: {
      type: ParameterType.COMPLEX,
      array: true,
      nested: {
        /** The ID of the image to be highlighted. This must match the ID of one of the images in the images array. */
        image_id: {
          type: ParameterType.STRING,
          default: undefined,
        },

        /** The time in milliseconds when the image should be highlighted. */
        time_onset : {
          type: ParameterType.INT,
          default: 0  
        }, 

        /** The time in milliseconds when the image should stop being highlighted. */
        time_offset : {
          type: ParameterType.INT,
          default: 0  
        }, 

      }
    },

    animations: {
      type: ParameterType.COMPLEX,
      array: true,
      nested: {
        /** The ID of the image to be animated. This must match the ID of one of the images in the images array. */
        image_id: {
          type: ParameterType.STRING,
          default: undefined,
        },
        
        /** The type of animation to be applied to the image. This can be either "shake", "bounce", or "flash". */    
        // animation_type: {
        //   type: ParameterType.STRING,
        //   default: undefined,
        // },
      
    },

    /** An array of objects. Each object represents an audio file that will be played. Each object contains a src, time_onset, and response_allowed_while_playing parameter that will be applied to the question. */
    audio: {
      type: ParameterType.COMPLEX,
      array: true,
      nested: {
        /** The path of the audio file to be played.  */
        src: {
          type: ParameterType.STRING,
          default: undefined,
        },

        /** The time in milliseconds when the audio should start playing. */
        time_onset : {
          type: ParameterType.INT,
          default: 0  
        },

        /** If true, then responses are allowed while the audio is playing. If false, then the audio must finish playing before the button choices are enabled and a response is accepted. Once the audio has played all the way through, the buttons are enabled and a response is allowed (including while the audio is being re-played via on-screen playback controls). */
        response_allowed_while_playing: {
          type: ParameterType.BOOL,
          default: true,
        },
      }
    }



  },
  data: {

    /** An object containing the response for each question. The object will have a separate key (variable) for each question, with the first question in the trial being recorded in `Q0`, the second in `Q1`, and so on. The responses are recorded as integers, representing the position selected on the likert scale for that question. If the `name` parameter is defined for the question, then the response object will use the value of `name` as the key for each question. This will be encoded as a JSON string when data is saved using the `.json()` or `.csv()` functions. */
    response: {
      type: ParameterType.OBJECT,
    },
    
    /** The response time in milliseconds for the participant to make a response. The time is measured from when the questions first appear on the screen until the participant's response(s) are submitted. */
    rt: {
      type: ParameterType.INT,
    },


  },
  // When you run build on your plugin, citations will be generated here based on the information in the CITATION.cff file.
  citations: '__CITATIONS__',
};

type Info = typeof info;

/**
 * **plugin-storybook**
 *
 * Animated storybook with audio
 *
 * @author Khuyen Le, Urvi Suwal, Valeria Inojosa,a Aiden Brown, Becky Gilbert, Siying Zhang
 * @see {@link /plugin-storybook/README.md}}
 */
class StorybookPlugin implements JsPsychPlugin<Info> {
  static info = info;

  constructor(private jsPsych: JsPsych) {}

  trial(display_element: HTMLElement, trial: TrialType<Info>) {
    // // display_element.innerHTML = "<p>This is a placeholder for the storybook plugin. The plugin is still in development, but you can see the progress on the GitHub repository:</p><p><a href='https://github.com/jspsych/plugin-storybook' target='_blank'>https://github.com/jspsych/plugin-storybook</a></p>";
    // const stimulusEvent = document.createElement("div"); 
    // stimulusEvent.id = "jspsych-storybook-stimulus-event";
    // stimulusEvent.innerHTML = "<p>This is a placeholder for the storybook plugin. The plugin is still in development, but you can see the progress on the GitHub repository:</p><p><a href='https://github.com/jspsych/plugin-storybook' target='_blank'>https://github.com/jspsych/plugin-storybook</a></p>";
    // display_element.appendChild(stimulusEvent);

    const calculateImageDimensions = (image: HTMLImageElement): [number, number] => {
      let width: number, height: number;

      // Convert vw/vh percentages to pixel values
      const vwToPx = (vw: number) => (vw / 100) * window.innerWidth;
      const vhToPx = (vh: number) => (vh / 100) * window.innerHeight;

      if (trial.height == null && trial.width == null) {
        width = image.naturalWidth;
        height = image.naturalHeight;
      } else if (trial.width !== null && trial.height == null) {
        width = vwToPx(trial.width);
        height = image.naturalHeight * (width / image.naturalWidth);
      } else if (trial.height !== null && trial.width == null) {
        height = vhToPx(trial.height);
        width = image.naturalWidth * (height / image.naturalHeight);
      } else {
        width = vwToPx(trial.width);
        height = vhToPx(trial.height);
      }

      return [width, height];
    };

    display_element.innerHTML = "";
    let stimulusElement: HTMLCanvasElement;
    let canvas: HTMLCanvasElement;


    const image = new Image();
    canvas = document.createElement("canvas");
    canvas.style.margin = "0";
    canvas.style.padding = "0";
    stimulusElement = canvas;
    

    const drawImage = () => {
      const [width, height] = calculateImageDimensions(image);
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(image, 0, 0, width, height);
    };

    let hasImageBeenDrawn = false;

    // if image wasn't preloaded, then it will need to be drawn whenever it finishes loading
    image.onload = () => {
      if (!hasImageBeenDrawn) {
        drawImage();
      }
    };

    image.src = trial.background_image;
    if (image.complete && image.naturalWidth !== 0) {
      // if image has loaded then draw it now (don't rely on img onload function to draw image
      // when image is in the cache, because that causes a delay in the image presentation)
      drawImage();
      hasImageBeenDrawn = true;
    }

    stimulusElement.id = "jspsych-storybook-background-image";
    display_element.appendChild(stimulusElement);
    
    
    // onload event background image
    // backhround image => start timer image onload 
    // image onload
    // for each image in the images array, loop through them, look for any that has a delay (onset time), then set up that time.
    // helper: jspsych.pluginAPI.setTimeout(() => {function that we wanna run is the one that displays the image}, time) to time the presentation of images and audio based on the time_onset parameter for each stimulus in the trial.
    // helper: jspsych.pluginAPI.clearAllTimeouts() to clear any timeouts that have been set when the trial ends. 


    
    
    // data saving
    var trial_data = {
      data1: 99, // Make sure this type and name matches the information for data1 in the data object contained within the info const.
      data2: "hello world!", // Make sure this type and name matches the information for data2 in the data object contained within the info const.
    };
    // end trial
    // this.jsPsych.finishTrial(trial_data);
  }
}

export default StorybookPlugin;
