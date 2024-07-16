document
  .getElementById("signin-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email-signin").value;

    console.log({ email });

    document.getElementById("email-signin").value = "";
  });

document
  .getElementById("signup-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email-signup").value;
    const name = document.getElementById("name-signup").value;

    console.log({ email, name });

    document.getElementById("email-signup").value = "";
    document.getElementById("name-signup").value = "";
  });
