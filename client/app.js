function base64ToUint8Array(base64) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

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

    try {
      const response = await fetch("/api/signup/start", {
        body: JSON.stringify({ email, name }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const options = await response.json();

      if (!response.ok) {
        throw new Error(options.message);
      }

      options.extensions = {
        credProps: true,
      };

      // Two ways of doing this:
      // (A) use the native browser API
      // options.challenge = base64ToUint8Array(options.challenge);
      // options.user.id = base64ToUint8Array(options.user.id);
      // const credential = await navigator.credentials.create({
      //   publicKey: options,
      // });
      // console.log(credential);

      // (B) Use a library,
      const authRes = await SimpleWebAuthnBrowser.startRegistration(options);
      console.log(authRes);

      await fetch("/api/signup/finish", {
        body: JSON.stringify({ email, data: authRes }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      document.getElementById("email-signup").value = "";
      document.getElementById("name-signup").value = "";
      document.getElementById("message").innerHTML =
        "User was registered successfully!";
    } catch (error) {
      console.error(error);
      document.getElementById("message").innerHTML = error.message;
    }
  });
