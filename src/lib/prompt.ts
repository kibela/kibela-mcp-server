const user = (text: string) => {
  return {
    messages: [
      {
        role: "user" as "user",
        content: {
          type: "text" as "text",
          text,
        },
      },
    ],
  };
};

export { user };
