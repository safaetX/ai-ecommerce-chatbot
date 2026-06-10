import Cart from "@/models/Cart";
import Product from "@/models/Product";
import ProductRequest from "@/models/ProductRequest";

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

  const normalizedSize =
    size.toUpperCase() as keyof typeof product.stock;

  if (
    !product.stock?.[normalizedSize] ||
    product.stock[normalizedSize] <= 0
  ) {
    await ProductRequest.create({
      userId,
      productId: product._id,
      size: normalizedSize,
    });

    return {
      success: false,
      outOfStock: true,
      message:
        `${product.name} size ${normalizedSize} is currently out of stock. ` +
        `A product request has been submitted for you.`,
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
      item.size === normalizedSize
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.items.push({
      productId: product._id,
       size: normalizedSize,
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

  const normalizedSize = size.toUpperCase();

  cart.items = cart.items.filter(
    (item: any) =>
      !(
        item.productId.toString() === product._id.toString() &&
        item.size === normalizedSize
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