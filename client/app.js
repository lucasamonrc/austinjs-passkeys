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

    const response = await fetch("/api/signup/start", {
      body: JSON.stringify({ email, name }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    const data = await response.json();

    console.log(data);

    document.getElementById("email-signup").value = "";
    document.getElementById("name-signup").value = "";
  });
