import Cart from "@/models/Cart";
import Product from "@/models/Product";

export async function addToCart(
  userId: string,
  productName: string,
  size: string
) {
  const product = await Product.findOne({
    name: productName.trim(),
  });

  if (!product) {
    return {
      success: false,
      message: "Product not found",
    };
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({
      userId,
      items: [],
    });
  }

  const existingItem = cart.items.find(
    (item: any) =>
      item.productId.toString() === product._id.toString() &&
      item.size === size
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.items.push({
      productId: product._id,
      size,
      quantity: 1,
    });
  }

  await cart.save();

  return {
    success: true,
    message: `${productName} (${size}) added to cart.`,
  };
}

export async function removeFromCart(
  userId: string,
  productName: string,
  size: string
) {
  const product = await Product.findOne({
    name: productName.trim(),
  });

  if (!product) {
    return {
      success: false,
      message: "Product not found",
    };
  }

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return {
      success: false,
      message: "Cart not found",
    };
  }

  cart.items = cart.items.filter(
    (item: any) =>
      !(
        item.productId.toString() === product._id.toString() &&
        item.size === size
      )
  );

  await cart.save();

  return {
    success: true,
    message: `${productName} (${size}) removed from cart.`,
  };
}

export async function checkout(userId: string) {
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return {
      success: false,
      message: "Cart not found",
    };
  }

  cart.items = [];

  await cart.save();

  return {
    success: true,
    message: "Order placed successfully!",
  };
}