import {
  BestSellingProductSchema,
  CartRemoveProductSchema,
  DealsOfDaySchema,
  ProductSchema,
} from "../schema/Product";
import {
  CitySchema,
  deliveryAddressSchema,
  RegionSchema,
  UpdateRegionSchema,
} from "../schema/deliveryAddress";
import { editProfileSchema } from "../schema/editProfile";
import { AdvertSchema, homePageBannerSchema } from "../schema/homePageBanner";
import { wishListSchema } from "../schema/wishList";
import { changePasswordSchema } from "../schema/changePassword";
import { contactUsSchema } from "../schema/contactUs";
import { corporateSchema } from "../schema/corporate";
import {
  couponCodeSchema,
  activateAndDeactivateCouponCodeSchema,
  applyCouponCodeCouponCodeSchema,
} from "../schema/couponCode";
import { orderSchema } from "../schema/Order";
import { ratingSchema } from "../schema/rating";
import { faqtSchema } from "../schema/faq";
import { topCategorySchema } from "../schema/topCcategory";
import { CategorySchema } from "../schema/category";
import { updateTopActiveSchema } from "../schema/updateTopActiveCategory";
import { menuSchema, menuCategorySchema } from "../schema/menu";
import { subMenuSchema } from "../schema/submenu";
import { productCustomizationSchema } from "../schema/customization"

export const CustomizationValidate = (req, res, next) => {
  try {
    const { error, value } = productCustomizationSchema.validate(req.body);
    if (error)
      return res.error(
        error.details[0].message.replace(new RegExp('"', "ig"), "")
      );

    return next();
  } catch (error) {
    throw new Error(error);
  }
};

export const ProductSchemaValidate = (req, res, next) => {
  try {
    const { error, value } = ProductSchema.validate(req.body);
    if (error)
      return res.error(
        error.details[0].message.replace(new RegExp('"', "ig"), "")
      );

    return next();
  } catch (error) {
    throw new Error(error);
  }
};

export const deliveryAddresSchemaValidate = (req, res, next) => {
  try {
    const { error, value } = deliveryAddressSchema.validate(req.body);
    if (error)
      return res.error(
        error.details[0].message.replace(new RegExp('"', "ig"), "")
      );

    return next();
  } catch (error) {
    throw new Error(error);
  }
};

export const editProfileValidate = (req, res, next) => {
  try {
    const { error, value } = editProfileSchema.validate(req.body);
    if (error)
      return res.error(
        error.details[0].message.replace(new RegExp('"', "ig"), "")
      );

    return next();
  } catch (error) {
    throw new Error(error);
  }
};

export const homePageBannerSchemaValidate = (req, res, next) => {
  try {
    const { error, value } = homePageBannerSchema.validate(req.body);
    if (error)
      return res.error(
        error.details[0].message.replace(new RegExp('"', "ig"), "")
      );

    return next();
  } catch (error) {
    throw new Error(error);
  }
};

export const wishListSchemaValidate = (req, res, next) => {
  try {
    const { error, value } = wishListSchema.validate(req.body);
    if (error)
      return res.error(
        error.details[0].message.replace(new RegExp('"', "ig"), "")
      );

    return next();
  } catch (error) {
    throw new Error(error);
  }
};

export const changePasswordSchemaValidate = (req, res, next) => {
  try {
    const { error, value } = changePasswordSchema.validate(req.body);
    if (error)
      return res.error(
        error.details[0].message.replace(new RegExp('"', "ig"), "")
      );

    return next();
  } catch (error) {
    throw new Error(error);
  }
};

export const regionSchemaValidate = (req, res, next) => {
  try {
    const { error, value } = RegionSchema.validate(req.body);
    if (error)
      return res.error(
        error.details[0].message.replace(new RegExp('"', "ig"), "")
      );

    return next();
  } catch (error) {
    throw new Error(error);
  }
};

export const citySchemaValidate = (req, res, next) => {
  try {
    const { error, value } = CitySchema.validate(req.body);
    if (error)
      return res.error(
        error.details[0].message.replace(new RegExp('"', "ig"), "")
      );

    return next();
  } catch (error) {
    throw new Error(error);
  }
};

export const contactUsSchemaValidate = (req, res, next) => {
  try {
    const { error, value } = contactUsSchema.validate(req.body);
    if (error)
      return res.error(
        error.details[0].message.replace(new RegExp('"', "ig"), "")
      );

    return next();
  } catch (error) {
    throw new Error(error);
  }
};

export const bestSellingProductSchemaValidate = (req, res, next) => {
  try {
    const { error, value } = BestSellingProductSchema.validate(req.body);
    if (error)
      return res.error(
        error.details[0].message.replace(new RegExp('"', "ig"), "")
      );

    return next();
  } catch (error) {
    throw new Error(error);
  }
};

export const updateRegionSchemaValidate = (req, res, next) => {
  try {
    const { error, value } = UpdateRegionSchema.validate(req.body);
    if (error)
      return res.error(
        error.details[0].message.replace(new RegExp('"', "ig"), "")
      );

    return next();
  } catch (error) {
    throw new Error(error);
  }
};

export const corporateSchemaValidate = (req, res, next) => {
  try {
    const { error, value } = corporateSchema.validate(req.body);
    if (error)
      return res.error(
        error.details[0].message.replace(new RegExp('"', "ig"), "")
      );
  } catch (error) {
    throw new Error(error);
  }
};

export const createDealsOfDaySchema = (req, res, next) => {
  try {
    const { error, value } = DealsOfDaySchema.validate(req.body);
    if (error)
      return res.error(
        error.details[0].message.replace(new RegExp('"', "ig"), "")
      );
  } catch (error) {
    throw new Error(error);
  }
};

export const createOrderSchemaValidate = (req, res, next) => {
  try {
    const { error, value } = orderSchema.validate(req.body);
    if (error)
      return res.error(
        error.details[0].message.replace(new RegExp('"', "ig"), "")
      );
    return next();
  } catch (error) {
    throw new Error(error);
  }
};
export const CouponCodeSchemaValidate = (req, res, next) => {
  try {
    const { error, value } = couponCodeSchema.validate(req.body);
    if (error)
      return res.error(
        error.details[0].message.replace(new RegExp('"', "ig"), "")
      );

    return next();
  } catch (error) {
    throw new Error(error);
  }
};

export const activateAndDeactivateCouponchemaValidate = (req, res, next) => {
  try {
    const { error, value } = activateAndDeactivateCouponCodeSchema.validate(
      req.body
    );
    if (error)
      return res.error(
        error.details[0].message.replace(new RegExp('"', "ig"), "")
      );

    return next();
  } catch (error) {
    throw new Error(error);
  }
};

export const applyCouponCodeCouponCodeSchemachemaValidate = (
  req,
  res,
  next
) => {
  try {
    const { error, value } = applyCouponCodeCouponCodeSchema.validate(req.body);
    if (error)
      return res.error(
        error.details[0].message.replace(new RegExp('"', "ig"), "")
      );

    return next();
  } catch (error) {
    throw new Error(error);
  }
};

export const CartRemoveProductSchemaValidate = (req, res, next) => {
  try {
    const { error, value } = CartRemoveProductSchema.validate(req.body);
    if (error)
      return res.error(
        error.details[0].message.replace(new RegExp('"', "ig"), "")
      );

    return next();
  } catch (error) {
    throw new Error(error);
  }
};

export const ratingSchemaValidate = (req, res, next) => {
  try {
    const { error, value } = ratingSchema.validate(req.body);
    if (error)
      return res.error(
        error.details[0].message.replace(new RegExp('"', "ig"), "")
      );

    return next();
  } catch (error) {
    throw new Error(error);
  }
};

export const faqtSchemaValidate = (req, res, next) => {
  try {
    const { error, value } = faqtSchema.validate(req.body);
    if (error)
      return res.error(
        error.details[0].message.replace(new RegExp('"', "ig"), "")
      );

    return next();
  } catch (error) {
    throw new Error(error);
  }
};

export const topCategorySchemaValidate = (req, res, next) => {
  try {
    const { error, value } = topCategorySchema.validate(req.body);
    if (error)
      return res.error(
        error.details[0].message.replace(new RegExp('"', "ig"), "")
      );

    return next();
  } catch (error) {
    throw new Error(error);
  }
};

export const CategorySchemaValidate = (req, res, next) => {
  try {
    const { error, value } = CategorySchema.validate(req.body);
    if (error)
      return res.error(
        error.details[0].message.replace(new RegExp('"', "ig"), "")
      );

    return next();
  } catch (error) {
    throw new Error(error);
  }
};

export const updateTopActiveSchemaValidate = (req, res, next) => {
  try {
    const { error, value } = updateTopActiveSchema.validate(req.body);
    if (error)
      return res.error(
        error.details[0].message.replace(new RegExp('"', "ig"), "")
      );

    return next();
  } catch (error) {
    throw new Error(error);
  }
};

export const menuSchemaValidate = (req, res, next) => {
  try {
    const { error, value } = menuSchema.validate(req.body);
    if (error)
      return res.error(
        error.details[0].message.replace(new RegExp('"', "ig"), "")
      );

    return next();
  } catch (error) {
    throw new Error(error);
  }
};

export const menuCategorySchemaValidate = (req, res, next) => {
  try {
    const { error, value } = menuCategorySchema.validate(req.body);
    if (error)
      return res.error(
        error.details[0].message.replace(new RegExp('"', "ig"), "")
      );

    return next();
  } catch (error) {
    throw new Error(error);
  }
};

export const subMenuSchemaValidate = (req, res, next) => {
  try {
    const { error, value } = subMenuSchema.validate(req.body);
    if (error)
      return res.error(
        error.details[0].message.replace(new RegExp('"', "ig"), "")
      );

    return next();
  } catch (error) {
    throw new Error(error);
  }
};

export const createAdvertSchemaValidate = (req, res, next) => {
  try {
    const { error, value } = AdvertSchema.validate(req.body);
    if (error)
      return res.error(
        error.details[0].message.replace(new RegExp('"', "ig"), "")
      );

    return next();
  } catch (error) {
    throw new Error(error);
  }
};
