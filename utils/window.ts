export default typeof window === 'undefined'
  ? (global as any)
  : (window as any);
