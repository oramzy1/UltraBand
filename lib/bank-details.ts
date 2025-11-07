export const BANK_DETAILS = {
  bankName: "Chase Bank",
  accountName: "Ultra Band Music Entertainment",
  accountNumber: "987364558",
  // Optional: Add other details
  routingNumberACH: "044000037",
  routingNumberWire: "021000021",
  swiftCode: "ABCDEFGH", // For international
};

export const PAYMENT_OPTIONS = [
  {
    id: "bank_transfer",
    name: "Bank Transfer",
    icon: "Building2",
  },
  {
    id: "zelle",
    name: "Zelle",
    icon: "Smartphone",
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: "CreditCard",
  },
];
