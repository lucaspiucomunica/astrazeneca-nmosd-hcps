/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "../../*",
    "../*/*"
  ],
  theme: {
    screens: {
      'xxs': '380px',
      'xs': '480px',
      'sm': '640px',
      'ms': '704px',
      'md': '768px',
      'ml': '896px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: {
          50: "#F2F7FC",
          100: "#E2EEF7",
          200: "#CBE1F2",
          300: "#A8CFE8",
          400: "#7EB5DC",
          500: "#679FD3",
          600: "#4C83C4",
          700: "#4270B3",
          800: "#3B5B92",
          900: "#334D75",
          950: "#233148",
        },
        secondary: {
          50: "#FDF3F5",
          100: "#FBE8ED",
          200: "#F6D5DE",
          300: "#EFB2C3",
          400: "#E37D9A",
          500: "#D75C82",
          600: "#C23C6C",
          700: "#A32D5A",
          800: "#892851",
          900: "#752649",
          950: "#411025",
        },
        neutrals: {
          50: '#FFFFFF',
          100: '#EFEFEF',
          200: '#DCDCDC',
          300: '#BDBDBD',
          400: '#989898',
          500: '#7C7C7C',
          600: '#656565',
          700: '#525252',
          800: '#464646',
          900: '#3D3D3D',
          950: '#292929',
        },
      },
      fontFamily: {
        'display': ['bahnschrift', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'hero': "url('../img/ilustracao-kv-2.webp')",
        'content-icon': "url('../img/grafismo-content-icon.webp')",
        'textura-1': "url('../img/textura-1.webp')",
        'kv': "url('../img/bg-kv.webp')",
      },
      container: {
        center: true,
        screens: {
          DEFAULT: '100%',
          sm: '100%',
          md: '100%',
          lg: '100%',
          xl: '100%',
          '2xl': '1660px',
        },
      },
      // lineHeight: {
      //   'normal': '148%',
      //   'tight': '120%',
      // },
      fontWeight: {
        'semilight': 300,
      },
    },
  },
  plugins: [],
}

