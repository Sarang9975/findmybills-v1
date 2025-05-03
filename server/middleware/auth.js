const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  console.log('Initializing Firebase Admin SDK...');
  initializeApp({
    credential: cert({
      projectId: "find-my-bills-95ab6",
      clientEmail: "firebase-adminsdk-fbsvc@find-my-bills-95ab6.iam.gserviceaccount.com",
      privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDYkaZgDMWVOH5A\nexQ8zKTQbtblClBXB9RLrkIQJmor9qQT0bjZhwWAXLYdM3fch2ux7QjBJqYBSkvi\nUOAxrVKbazAgZX/vXnpzS7p2QA4AVsSeDdSp1Hp8Co6lEWR/7ReX+Y8AWddkjLF+\nYjFDAhx5RiMo9a+kiXvKiWvL7SPnjAe8qaRVcFnb8f2wh8882VhOnBvlsdARK910\n2fxQ1qgguI+6/1Hrd22LiBcxc7yMvCG6w+EjKW2unWsryzxRSE6GEVb3LihcGwXv\nYCvZ/fiNT5DvcpbqQBAvsc7AMNF3MnneP9CnkmfdWaUz5ezeM1dOASPo/97sNRdZ\nHAvaGLxVAgMBAAECggEAOXKVYCgzJ0ynjOI5MZGVbKbiQTp1qkhs47BzXMZb5pKT\n3qAEuUssResR8fgLpQeVJUr7xgTDB1eWfo+2kObpoUmTKBzUjYIR2FCvwxtlu2hI\n2qZPkcdHwGyqfxX4g0i4t/semFi8nrMFiEFy0NQYCoF05TIa5/oCSO0gF6WtnwdU\nm8/9tkz0yrfIX0ZUpA47mvlC7dXXM04ZAhVRqmYiq7+s/LPw4zxXFo1pIkVKgwUm\nI+XCGgDEc55s1BXFDKe/Ebee1Qt9BHfJ6qmdrliFBQdKTCyknVzA9ZhtP+K2qaWO\nA9+QAQ962QZnVxDUPwYivjm/Tc+0ovvO8rpO3oPAFwKBgQD3ClaGjIWKPQFfFlos\nM2XmG0tfBiRLqfsgTbGIYaY7gOgiUlcth8T2QIQlmreJPcYR6g1poacwsLiH1tGu\njdKRYEVhTxBqUUhxx/1KkKSbqDvgUl551k/TuSqKl5QOz+KyN0Kg1f2H1DM1xi3o\nCqy1mGsIp1tyOLdKKdhHU55c+wKBgQDgbGXehqneegGxVwabg4PApDwHBf2M3kXy\nXKE62qRs66WQiBNFTmheWWNEp3b4cAhqQp42qDtocvzghspmX4qQrSczHp31aWqW\nTBMzhAc9QX3BN6ff/s8TjptPbxkF4tZbMrh6auYnw82F6k+dsG+n0pL78tZUu2/Q\nIvjoaEBq7wKBgFZXBaCm0jFbWvRZwpA6Mn32wiPm6J6NPRiwLsEkp82aIweD0bY3\nAm6yY70k0sqjjWtLav6lIeLRkNzhBo3EQXjPtc/pqyoNWI1zwSHjZbSFWs/u2dgp\nP+MWjzi6+2Ml4uw4hg/iWmazkmZT6k10FaKuL5Jps3s7OUwxTca4AdwrAoGBAM7R\nlp+YInuwnFa+CIzQil7B+7/NOXjUbkmIK919GQJ3t8CWZov8UhqA7gaa/fy94kNq\n2TstlnIPZhPUpDnr2lqx9+oYUSGU4HFZ8mgLSFCfRjEGBWNcA6HWTjLKA5l1Dm5F\nM9U9JpWG0KSU5oI/0uYqHOKrS/ISOlzpndEwIg1pAoGASdEvuKH7TRYAr/loQ7yX\nJZUX53whkB7/Ggjao5739BZgalTZN9Gt09NFzVtEwyM/DJfo7+a3FjcJwRaSixgG\nje1rnm0GrTGavxSImPoWHcjVimY1eTS55AdzncSCzo8NW31ClxbIhREoMyHhJGbb\nZU6P/NGSVjkHzq8d/fcyssI=\n-----END PRIVATE KEY-----\n"
    })
  });
  console.log('Firebase Admin SDK initialized successfully');
}

module.exports = async function (req, res, next) {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Check if no token
  if (!token) {
    console.log('No token provided in request');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    console.log('Verifying token...');
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(token);
    console.log('Token verified successfully:', {
      uid: decodedToken.uid,
      phoneNumber: decodedToken.phone_number
    });
    
    req.user = {
      id: decodedToken.uid,
      phoneNumber: decodedToken.phone_number
    };
    next();
  } catch (err) {
    console.error('Error verifying token:', {
      error: err.message,
      code: err.code,
      stack: err.stack
    });
    res.status(401).json({ msg: 'Token is not valid' });
  }
}; 