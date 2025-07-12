interface SuccessBarProps {
  progress: number; // Progress percentage
}

const SuccessBar: React.FC<SuccessBarProps> = ({ progress }) => {
  return (
    <div style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '5px', marginTop: '10px' }}>
      <div
        style={{
          width: `${progress}%`,
          height: '20px',
          backgroundColor: '#76c7c0',
          borderRadius: '5px',
          textAlign: 'center',
          lineHeight: '20px',
          color: 'white',
        }}
      >
        {progress}%
      </div>
    </div>
  );
};

export default SuccessBar;