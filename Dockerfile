# Use an official Nginx image as the base image
FROM nginx:alpine

# Copy the build output to the default Nginx public directory
COPY ./dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port 80 to the outside world
EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
