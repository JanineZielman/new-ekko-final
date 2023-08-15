// import Head from 'next/head';

const SEO = ({ title, description, imageUrl }) => {
  if (!title && !description && !imageUrl) {
    return null;
  }

  return (
    <>
      <head>
        <meta property="og:type" content="website" />
        <meta property="twitter:card" content="summary_large_image" />

        {title && (
          <>
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta property="og:title" content={title} />
            <meta property="twitter:title" content={title} />
          </>
        )}

        {description && (
          <>
            <meta name="description" content={description} />
            <meta property="og:description" content={description} />
            <meta property="twitter:description" content={description} />
          </>
        )}

        {imageUrl && (
          <>
            <meta property="og:image" content={imageUrl} />
            <meta property="twitter:image" content={imageUrl} />
          </>
        )}

        {/* {url && (
          <>
            <meta property="og:url" content={url} />
            <meta property="twitter:url" content={url} />
          </>
        )} */}
      </head>
    </>
  );
}


export default SEO