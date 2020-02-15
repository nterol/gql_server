import mjml2html = require('mjml');

export const registerEmailHTML = (url: string): string => {
    const template = mjml2html(`<mjml>
<mj-body background-color="#faf6f0">
  <mj-section>
    <mj-column>

      <mj-image width="50px" src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/237/waving-hand-sign_1f44b.png"></mj-image>
      <mj-divider border-color="#14134f"></mj-divider>

      <mj-text font-size="20px" color="#242168" font-family="helvetica">Welcome to Grimoire !
      <p>Please verify your email adress by clicking this button to verify your email adress !</p></mj-text>

      <mj-button href="${url}" background-color="#242168" color="#faf6f0">Confirm	 my email address</mj-button>

    </mj-column>
  </mj-section>
</mj-body>
</mjml>`);

    return template.html;
};

// Use it like this :
// (registerEmailHTML(url) as unknown) as string,
