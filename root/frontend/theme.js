import { extendTheme } from "native-base";
const theme = extendTheme({
  components: {
    Button: {
      defaultProps: {
        colorScheme: "indigo",
      },
    },
    Fab: {
      defaultProps: {
        colorScheme: "indigo",
      },
    },
  },
});

export default theme;
