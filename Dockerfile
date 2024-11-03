# Use the official rstudio/plumber image
FROM rstudio/plumber:latest

RUN apt-get update && apt-get install -y  git-core libcurl4-openssl-dev libgit2-dev libicu-dev libsodium-dev libssl-dev libxml2-dev make pandoc pandoc-citeproc zlib1g-dev && rm -rf /var/lib/apt/lists/*

COPY ./packages.R /packages.R

# Set the working directory
WORKDIR /app



RUN Rscript /packages.R

# Copy the Plumber API script into the container
COPY . /app

# Expose the port that Plumber will run on
EXPOSE 3070

# Command to run the Plumber API
CMD ["plumber", "api.R"]
