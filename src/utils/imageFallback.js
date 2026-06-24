/**
 * Returns a high-quality relevant Unsplash fallback image based on the service title
 * to handle cases where backend-uploaded files are missing on Render's ephemeral storage.
 * 
 * @param {string} title - The title of the service
 * @returns {string} - The URL of a high-quality fallback image
 */
export const getServiceFallbackImage = (title = '') => {
  const lowercaseTitle = title.toLowerCase();
  
  if (lowercaseTitle.includes('tipper') || lowercaseTitle.includes('dumper')) {
    // Commercial Tipper/Dumper Works - Heavy truck / tipper body
    return 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80';
  }
  if (lowercaseTitle.includes('container') || lowercaseTitle.includes('box body') || lowercaseTitle.includes('fabrication')) {
    // Container and Box Body Fabrication - Shipping container / corrugated steel panel logistics
    return 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80';
  }
  if (lowercaseTitle.includes('cargo') || lowercaseTitle.includes('platform') || lowercaseTitle.includes('flatbed')) {
    // Cargo body and platform works - Heavy duty truck cargo chassis
    return 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=800&q=80';
  }
  
  // Default premium industrial engineering/fabrication fallback
  return 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80';
};
