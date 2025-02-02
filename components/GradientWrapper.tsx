const GradientWrapper = ({ children, ...props }: any) => (
  <div
    
  >
    <div

      className="custom-screen blur-[100px] absolute inset-0 w-full h-full pointer-events-none"
      style={{
        background:
          'linear-gradient(202.72deg, rgba(237, 78, 80, 0.05) 14.76%, rgba(152, 103, 240, 0.04) 34.37%, rgba(152, 103, 240, 0) 86.62%)',
      }}
    />
    <div className="relative">{children}</div>
  </div>
);

export default GradientWrapper;
