import jwt from 'jsonwebtoken';

const userAuth = (req, res, next) => {
  const authHeader = req?.headers?.authorization;

  if (!authHeader || !authHeader?.startsWith("Bearer")) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  const token = authHeader?.split(" ")[1];

  try {
    const userToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.body.user = {
      userId: userToken.userId,
    };

    next();
  } catch (error) {
    console.log("JWT Verify Error:", error);
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

export default userAuth;
