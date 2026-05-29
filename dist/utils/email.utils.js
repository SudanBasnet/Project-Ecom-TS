"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLoginSuccessEmailHtml = void 0;
const generateLoginSuccessEmailHtml = (req, user) => {
    const html = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Login Successful</title>
    </head>

    <body
      style="
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
        font-family: Arial, sans-serif;
      "
    >
      <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        style="padding: 40px 0"
      >
        <tr>
          <td align="center">
            <table
              width="600"
              cellpadding="0"
              cellspacing="0"
              style="
                background-color: #ffffff;
                border-radius: 10px;
                overflow: hidden;
              "
            >
              <!-- Header -->
              <tr>
                <td
                  align="center"
                  style="
                    background-color: #111827;
                    color: #ffffff;
                    padding: 30px;
                    font-size: 28px;
                    font-weight: bold;
                  "
                >
                  Project Ecommerce
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 40px">
                  <h2 style="margin-top: 0; color: #111827">
                    Login Successful ✅
                  </h2>

                  <p
                    style="
                      font-size: 16px;
                      color: #4b5563;
                      line-height: 1.6;
                    "
                  >
                    Hello <strong>${user.full_name}</strong>,
                  </p>

                  <p
                    style="
                      font-size: 16px;
                      color: #4b5563;
                      line-height: 1.6;
                    "
                  >
                    Your account was successfully logged in.
                  </p>

                  <table
                    width="100%"
                    cellpadding="10"
                    cellspacing="0"
                    style="
                      margin-top: 20px;
                      border: 1px solid #e5e7eb;
                      border-collapse: collapse;
                    "
                  >
                    <tr>
                      <td
                        style="
                          border: 1px solid #e5e7eb;
                          font-weight: bold;
                          background-color: #f9fafb;
                        "
                      >
                        Full Name
                      </td>
                      <td style="border: 1px solid #e5e7eb">
                        ${user.full_name}
                      </td>
                    </tr>

                    <tr>
                      <td
                        style="
                          border: 1px solid #e5e7eb;
                          font-weight: bold;
                          background-color: #f9fafb;
                        "
                      >
                        Email
                      </td>
                      <td style="border: 1px solid #e5e7eb">
                        ${user.email}
                      </td>
                    </tr>

                    <tr>
                      <td
                        style="
                          border: 1px solid #e5e7eb;
                          font-weight: bold;
                          background-color: #f9fafb;
                        "
                      >
                        User ID
                      </td>
                      <td style="border: 1px solid #e5e7eb">
                        ${user._id}
                      </td>
                    </tr>
                  </table>

                  <p
                    style="
                      margin-top: 30px;
                      font-size: 15px;
                      color: #6b7280;
                      line-height: 1.6;
                    "
                  >
                    If this login was not made by you, please reset your
                    password immediately.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td
                  align="center"
                  style="
                    background-color: #f3f4f6;
                    padding: 20px;
                    font-size: 14px;
                    color: #6b7280;
                  "
                >
                  © 2026 Project Ecommerce. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
    return html;
};
exports.generateLoginSuccessEmailHtml = generateLoginSuccessEmailHtml;
