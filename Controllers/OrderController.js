const OrderModal = require("../models/OrderModal");
const ErrorHandler = require("../utils/errorHandler");
const { GoogleAuth } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const TevoClient = require("ticketevolution-node");
const path = require("path");
const ejs = require('ejs');
const SendEmail = require("../middleware/SendEmail");
// const API_TOKEN = "eebbfa6848026f8e3f6b1ac5f87e1e46";
// const API_SECRET_KEY = "iEzrOJOJ0RTDqRXOnHAZX5ceyfdGITbNy1qd2EXV";
const API_TOKEN = "10cbbac87aa33cf9818fc1046bca0044";
const API_SECRET_KEY = "7bThxZPz3L+KdAdGsjcM9c99mCoyvXt3jH2MDy0/";
const X_Signature = "z0g8oHXZyOi7Is0qM0KWVvgY9VQLRSadommuh0q6nuQ=";

const tevoClient = new TevoClient({
  apiToken: API_TOKEN,
  apiSecretKey: API_SECRET_KEY,
});

// TODO: Define Issuer ID
const issuerId = "3388000000022328102";

// TODO: Define Class ID
const classId = `${issuerId}.codelab_class`;

const baseUrl = "https://walletobjects.googleapis.com/walletobjects/v1";

// const credentials = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const credentials = {
  type: "service_account",
  project_id: "u-lms-399610",
  private_key_id: "a6ae5360d598c1fbf43475f5dbe960888dd8dfd3",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDhIAKxX5/kz6Ce\n3EVeMl4Z0f3m6/q97tN6QkYP/ZULyGfmr/N9DCI4UrwJTqswf6ISPyHqNg9czGmc\n4/O8yIEOGpA3r5+K23oYkJ8rniLBzI0RTuYz2Knp4wyTw43wUvT97G/894jIKC+c\nJs0qp/WVKRnTRccDmjRMfWjpcwQBBXLvM53Y6TTXv2ShcnPlRDPwDA9vH1qBtH/P\nLWnq7OmzXSRCsg9WR9CAUrsMwKfknZcFmlVwg72Ai7kc4ZwmM4Q67Ft6fRzW5xEE\nxMroEmkwyCiSAW2O2k4xCuYi+NwNwu/wpesgNv7LLzQKOquefcpBqRccfTqO4aTn\ng7ea9p/nAgMBAAECggEAEY71Fs9+AZMeFHXapTOpejsSIgoituCjNuRnYYTmNJKP\nZAMyKv0gyCLPzqwHlxNFWUX6R7GqthKtZBK1ZnJ++lIhEG7Osz5WAgd5mqXNUS86\ni3CLbNzHt9nBF99HOUjHGezweRr3XKEhwXyXQO3zrgwUGxHUqVfEH3kijx6s38Vf\nFDC5wubYYXfA/YORlEDn/n48jYx/fky6n5zyCHX9Qgv8kF/dOGktDRCbr9bz/zsG\nbczY5e/j8OhCnenzMI7twZORqy6saDdHOJNWcAJi5hbzH14MosjW61GdKKuXfybL\nbjBvOpSra0q6/O1nSVWEHzQW5y4m4XFUIyWCANbcmQKBgQDxE5hMpGqX8bM9gFYh\npUnn8DUR+xNqwrLBP/iJ9a/vAuJoFWbkqIH3VjhIQiVsS6efFcY1/fy6pqNusW0k\n8pd2WQ28ZVi2LMqqe0Dw+i03xV7KQnRzDnWIEPQFv9Zypky3G1WFL7+YJBuorqti\nViNuUN6zZpNh4ljy2C3jrm12/wKBgQDvD6C6hgZMjLFBCLEwU9Yf2yraGvigmY77\nkY6Xas6pAIADZvFjTx7yuEgJWA8ojoRycu61AaaLabxxE0FTV3aTh2c1/tzz9F/9\nq55lCvo1IH6rDBrp+3/PAdZlRMV/x3TkBKynzELp8pG2/0l1q2CSWE1GximmNeBj\nGuWvJUL/GQKBgG3Iw6GbemNpkXufdxnpYMe8Dx76HPSQZ8EztaZ1+UG6KYrGvE3D\nIzSU0hqt7MbtiQ8cZmBuIuqJOoINUKvzweAGXAgAiy6jJUQPzxoug+sS+cDYFJnU\n6tclCUuY+jrJ2sPEMeTuQq0xPFtL+AZXPdleAJzoSJPZ9THaGsPFylnXAoGBAJpF\nB3/WxXHYyPoi1dVOBLwB/yFIjnF1JuQJBm+IKVy+Sd3oLJXdlSck7Le67+1IKwiA\nSrLcIdGNpmGB/4H8yzRhCKW7lnKHnPpiKZEjCFwIYDWZVjTwa4X2tZgcTScsW65Z\npeGS2wuF0aq6C3m34lYOTbACaRYtZmQOE3J3JUjhAoGAKla0CUZHG85I1rXnA0uB\nPNIVd834oaQHr57iRTCCGkTvVJMQSCGcItt6wZRAt4rQ1T87aRT33zht9KLIU2Ow\n1ZegYci8n9GWQ7gmmOBpIkgxbdWD24uBqev1wk+S5mWS3cOQNlljMRMeVaB8ZPZ1\nmC4+zGGuuwpV9bQutsvViLo=\n-----END PRIVATE KEY-----\n",
  client_email: "googlewallet@u-lms-399610.iam.gserviceaccount.com",
  client_id: "112386233385056636520",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/googlewallet%40u-lms-399610.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

const httpClient = new GoogleAuth({
  credentials: credentials,
  scopes: "https://www.googleapis.com/auth/wallet_object.issuer",
});

module.exports = {
  // --- create order by single ticket
  createOrder: async (req, res, next) => {
    try {
      const {
        totalamount,
        type,
        payments,
        service_fee,
        tax,
        id,
        name,
        price,
        qty,
        order_Id,
        item_id,
        fname,
        lname,
        email
        
      } = req.body;
      const newOrder = await OrderModal.create({
        user: req.user === null ? null : req.user._id,
        totalAmount: totalamount,

        items: [
          {
            ticket_group_id: id,
            splits: qty,
            price: price,
            name: name,
          },
        ],
        type: type,
        shiptoName: fname + " " + lname,
        shiptoEmail: email,
        payments: payments,
        service_fee: service_fee,
        tax: tax,
        order_Id: order_Id,
        item_id: item_id,

      });
      const templatePath = path.join(__dirname, '..', 'templates', 'Ordertemplate.ejs');
      
      const emailContent = await ejs.renderFile(templatePath, {
        title: fname + " " + lname ,
        qty: qty,
        price: price,
        tax: tax,
        orderId: order_Id,
        discount: 0,
        total: totalamount,
        id : id
      });
      try {


        await SendEmail({
          email : email,
          subject: 'Instapass Order',
          html : true,
          template : emailContent
        });

        res.status(200).json({
          success: true,
          message: "Order created successfully",
          // newOrder,
        });
      } catch (error) {
      next(new ErrorHandler(error.message, 400));
        
      }

     
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  },

  // ---- get user all orders
  getUserOrders: async (req, res, next) => {
    try {
      const userId = req.user._id;
      const orders = await OrderModal.find({ user: userId });
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  },
  // ------ get all orders for admin
  getAllOrdersForAdmin: async (req, res, next) => {
    try {
      const orders = await OrderModal.find();
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  },

  // ---- print the order
  printEticket: async function (req, res) {
    // ... existing code ...
    const { orderId, itemId } = req.params;
    const url =
      "https://api.sandbox.ticketevolution.com/v9/orders/" + orderId + "/print";
    // const url =
    //   "https://api.sandbox.ticketevolution.com/v9/orders/" +
    //   orderId +
    //   "/print_etickets?item_id=" +
    //   itemId;
    tevoClient
      .getJSON(url)
      .then((json) => {
        return res.send(json);
      })
      .catch((err) => {
        return res.send("error: " + err);
      });
  },

  // ---- send email notify
  EmailNotify: async function (req, res) {
    const { orderId } = req.params;
    const url = `https://api.sandbox.ticketevolution.com/v9/orders/${orderId}/email`;
    await tevoClient
      .postJSON(url, {
        recipients: ["ua46792@gmail.com"],
      })
      .then((json) => {
        return res.send(json);
      })
      .catch((err) => {
        return res.send("error: " + err);
      });
  },

  // ----- create shipment
  CreateShipMent: async (req, res, next) => {
    const requestBody = req.body;
    const url =
      "https://api.sandbox.ticketevolution.com/v9/shipments/suggestion";
    tevoClient
      .postJSON(url, requestBody)
      .then((json) => {
        return res.send(json);
      })
      .catch((err) => {
        return res.send("error: " + err);
      });
  },

  // --- send to email
  sendEmailNotify: function (req, res) {
    const requestBody = req.body;
    const url =
      "https://api.sandbox.ticketevolution.com/v9/orders/" +
      req.query.order_id +
      "/email_etickets_link";
    tevoClient
      .postJSON(url, requestBody)
      .then((json) => {
        return res.send(json);
      })
      .catch((err) => {
        return res.send("error: " + err);
      });
  },

  // --- get pass to googlr wallet
  GetPassToGoogleWallet: async (req, res, next) => {
    try {
      const { client_email } = req.body;
      if (!client_email) {
        return next(new Error("Plaese Enter Your Email", 400));
      }
      await createPassClass(req, res);
      await createPassObject(req, res);
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  },

  // ---- get order details by Order id
  FindOrderbyId: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) {
        return next(new ErrorHandler("Invalid Order id", 400));
      }

      const order = await OrderModal.findById(id).populate("user");
      res.status(200).json({
        success: true,
        order: order,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  },

  // ==== update order conroller
  UpdateOrderController: async (req, res, next) => {
    try {
      const { Orderstatus } = req.body;
      if (!Orderstatus) {
        return next(new ErrorHandler("Order status is requird", 400));
      }

      const order = await OrderModal.findById(req.params.id);
      if (!order) {
        return next(new ErrorHandler("Order not found", 400));
      }

      order.status = Orderstatus;
      await order.save();

      res.status(200).json({
        success: true,
        message: "Order updated successfully",
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  },
};

// ==================== call and object function
async function createPassClass(req, res) {
  // TODO: Create a Generic pass class
  let genericClass = {
    id: `${classId}`,
    classTemplateInfo: {
      cardTemplateOverride: {
        cardRowTemplateInfos: [
          {
            twoItems: {
              startItem: {
                firstValue: {
                  fields: [
                    {
                      fieldPath: 'object.textModulesData["points"]',
                    },
                  ],
                },
              },
              endItem: {
                firstValue: {
                  fields: [
                    {
                      fieldPath: 'object.textModulesData["contacts"]',
                    },
                  ],
                },
              },
            },
          },
        ],
      },
      detailsTemplateOverride: {
        detailsItemInfos: [
          {
            item: {
              firstValue: {
                fields: [
                  {
                    fieldPath: 'class.imageModulesData["event_banner"]',
                  },
                ],
              },
            },
          },
          {
            item: {
              firstValue: {
                fields: [
                  {
                    fieldPath: 'class.textModulesData["game_overview"]',
                  },
                ],
              },
            },
          },
          {
            item: {
              firstValue: {
                fields: [
                  {
                    fieldPath: 'class.linksModuleData.uris["official_site"]',
                  },
                ],
              },
            },
          },
        ],
      },
    },
    imageModulesData: [
      {
        mainImage: {
          sourceUri: {
            uri: "https://storage.googleapis.com/wallet-lab-tools-codelab-artifacts-public/google-io-2021-card.png",
          },
          contentDescription: {
            defaultValue: {
              language: "en-US",
              value: "Google I/O 2022 Banner",
            },
          },
        },
        id: "event_banner",
      },
    ],
    textModulesData: [
      {
        header: "Gather points meeting new people at Google I/O",
        body: "Join the game and accumulate points in this badge by meeting other attendees in the event.",
        id: "game_overview",
      },
    ],
    linksModuleData: {
      uris: [
        {
          uri: "https://io.google/2022/",
          description: "Official I/O '22 Site",
          id: "official_site",
        },
      ],
    },
  };

  let response;
  try {
    // Check if the class exists already
    response = await httpClient.request({
      url: `${baseUrl}/genericClass/${classId}`,
      method: "GET",
    });

    console.log("Class already exists");
    console.log(response);
  } catch (err) {
    if (err.response && err.response.status === 404) {
      // Class does not exist
      // Create it now
      response = await httpClient.request({
        url: `${baseUrl}/genericClass`,
        method: "POST",
        data: genericClass,
      });

      console.log("Class insert response");
      console.log(response);
    } else {
      // Something else went wrong
      console.log(err);
      return res.send("Something went wrong...check the console logs!");
    }
  }
}

async function createPassObject(req, res) {
  let objectSuffix = `${req.body.client_email.replace(/[^\w.-]/g, "_")}`;
  // let objectId = `${issuerId}.${objectSuffix}`;
  // let objectSuffix = encodeURIComponent(
  //   req.body.client_email.replace(/[^\w.-]/g, "_")
  // );
  // let objectId = `localhost:3000/tickets/${issuerId}`;
  let objectId = `${objectSuffix}`;
  // let objectId = `google.com/tickets/${issuerId}`;
  // console.log(objectId);

  let genericObject = {
    id: `${objectId}`,
    classId: classId,
    genericType: "GENERIC_TYPE_UNSPECIFIED",
    hexBackgroundColor: "#4285f4",
    logo: {
      sourceUri: {
        uri: "https://storage.googleapis.com/wallet-lab-tools-codelab-artifacts-public/pass_google_logo.jpg",
      },
    },
    cardTitle: {
      defaultValue: {
        language: "en",
        value: "Google I/O '22",
      },
    },
    subheader: {
      defaultValue: {
        language: "en",
        value: "Instap",
      },
    },
    header: {
      defaultValue: {
        language: "en",
        value: "Alex InstaPass",
      },
    },
    barcode: {
      type: "QR_CODE",
      // value: `localhost:3000/tickets/${issuerId}`,
      value: `${objectId}`,
    },
    heroImage: {
      sourceUri: {
        uri: "https://storage.googleapis.com/wallet-lab-tools-codelab-artifacts-public/google-io-hero-demo-only.jpg",
      },
    },
    textModulesData: [
      {
        header: "POINTS",
        body: "1234",
        id: "points",
      },
      {
        header: "CONTACTS",
        body: "20",
        id: "contacts",
      },
    ],
  };

  // TODO: Create the signed JWT and link
  // res.send("Form submitted!");
  // TODO: Create the signed JWT and link
  const claims = {
    iss: credentials.client_email,
    aud: "google",
    origins: ["*"],
    typ: "savetowallet",
    payload: {
      genericObjects: [genericObject],
    },
  };

  // console.log(credentials.private_key);

  const token = jwt.sign(claims, credentials.private_key, {
    algorithm: "RS256",
  });
  const saveUrl = `https://pay.google.com/gp/v/save/${token}`;

  res.send(`<a href='${saveUrl}'><img src='/wallet-button.png'></a>`);
}
