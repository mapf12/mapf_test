import { Editor, mergeAttributes } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import TiptapImage from '@tiptap/extension-image';
//import InsertImageCommandButton from '@/components/MenuCommands/Image/InsertImageCommandButton.vue';
//import ImageView from '@/components/ExtensionViews/ImageView.vue';

export const ImageDisplay = {
  INLINE : 'inline',
    BREAK_TEXT : 'block',
    FLOAT_LEFT : 'left',
    FLOAT_RIGHT : 'right',
};
export const DEFAULT_IMAGE_URL_REGEX = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
export const DEFAULT_IMAGE_WIDTH = 200;
export const DEFAULT_IMAGE_DISPLAY = ImageDisplay.INLINE;


const Image = TiptapImage.extend({
  inline() {
    return true;
  },

  group() {
    return 'inline';
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: DEFAULT_IMAGE_WIDTH,
        parseHTML: (element) => {
          const width =
            element.style.width || element.getAttribute('width') || null;
          return width == null ? null : parseInt(width, 10);
        },
        renderHTML: (attributes) => {
          return {
            width: attributes.width,
          };
        },
      },
      height: {
        default: null,
        parseHTML: (element) => {
          const height =
            element.style.height || element.getAttribute('height') || null;
          return height == null ? null : parseInt(height, 10);
        },
        renderHTML: (attributes) => {
          return {
            height: attributes.height,
          };
        },
      },
      display: {
        default: DEFAULT_IMAGE_DISPLAY,
        parseHTML: (element) => {
          const { cssFloat, display } = element.style;
          let dp =
            element.getAttribute('data-display') ||
            element.getAttribute('display');
          if (dp) {
            dp = /(inline|block|left|right)/.test(dp)
              ? dp
              : ImageDisplay.INLINE;
          } else if (cssFloat === 'left' && !display) {
            dp = ImageDisplay.FLOAT_LEFT;
          } else if (cssFloat === 'right' && !display) {
            dp = ImageDisplay.FLOAT_RIGHT;
          } else if (!cssFloat && display === 'block') {
            dp = ImageDisplay.BREAK_TEXT;
          } else {
            dp = ImageDisplay.INLINE;
          }

          return dp;
        },
        renderHTML: (attributes) => {
          return {
            ['data-display']: attributes.display,
          };
        },
      },
    };
  },

  addOptions() {
    return {
      ...this.parent?.(),
      inline: true,
      uploadRequest: null,
      urlPattern: DEFAULT_IMAGE_URL_REGEX,
      // button:  {
      //     component: InsertImageCommandButton,
      //     componentProps: {
      //       editor,
      //     },
      // },
    };
  },

  // addNodeView() {
  //   return VueNodeViewRenderer(ImageView);
  // },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
    ];
  },
});

export default Image;
