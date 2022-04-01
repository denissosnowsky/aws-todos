export const notifyErrorAlert = (
    text: string,
    handler: (arg: string) => void
  ) => {
    handler(text);
    setTimeout(() => {
      handler("");
    }, 3000);
  };
  