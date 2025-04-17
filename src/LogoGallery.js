export const LogoGallery=({ folderPath, logoFiles }) => {
    return (
      <div className="logos">
        {logoFiles.map((logo) => (
          <img 
            key={logo} 
            src={`${folderPath}/${logo}`}
            alt={logo.split('.')[0]}
          />
        ))}
      </div>
    );
  }