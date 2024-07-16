document
  .getElementById("signup-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email-signup").value;
    const name = document.getElementById("name-signup").value;

    try {
      let response = await fetch("/api/signup/start", {
        body: JSON.stringify({ email, name }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      let data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      data.extensions = {
        credProps: true,
      };

      const registration = await SimpleWebAuthnBrowser.startRegistration(data);

      response = await fetch("/api/signup/finish", {
        body: JSON.stringify({ email, data: registration }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      document.getElementById("email-signup").value = "";
      document.getElementById("name-signup").value = "";
      document.getElementById("message").innerHTML =
        "User was registered successfully!";
    } catch (error) {
      console.error(error);
      document.getElementById("message").innerHTML = error.message;
    }
  });

document
  .getElementById("signin-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email-signin").value;

    try {
      let response = await fetch("/api/signin/start", {
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      let data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      const authentication = await SimpleWebAuthnBrowser.startAuthentication(
        data
      );

      response = await fetch("/api/signin/finish", {
        body: JSON.stringify({ email, data: authentication }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      document.getElementById("profile").innerHTML = `
        <div><strong>ID:</strong> ${data.user.id}</div>
        <div><strong>E-mail:</strong> ${data.user.email}</div>
        <div><strong>Name:</strong> ${data.user.name}</div>
      `;

      document.getElementById("email-signin").value = "";
      document.getElementById("message").innerHTML = "";
    } catch (error) {
      console.error(error);
      document.getElementById("message").innerHTML = error.message;
    }
  });
