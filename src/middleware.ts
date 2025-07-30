// Simplified middleware - bypass all authentication for demo
export const onRequest = async (context: any, next: any) => {
  // Pass through all requests without authentication checks
  return next();
};
