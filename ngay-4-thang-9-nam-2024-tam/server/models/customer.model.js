const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Customer name is required"],
  },
  address: {
    type: String,
    required: [true, "Customer address is required"],
  },
  email: {
    type: String,
    required: [true, "Customer email is required"],
    unique: true,
  },
  phone: {
    type: String,
    required: [true, "Customer phone number is required"],
    unique: true,
  },
  orders: [
    {
      orderDate: {
        type: Date,
        required: true,
      },
      requiredDate: {
        type: Date,
        required: true,
      },
      shipAddress: {
        type: String,
        required: true,
      },
      products: [
        {
          code: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          price: {
            type: Number,
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
          discount: {
            type: Number,
            default: 0,
          },
        },
      ],
    },
  ],
});

const Customer = mongoose.model("customer", customerSchema);

module.exports = Customer;
