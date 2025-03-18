#!/usr/bin/env python3

import sys
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

def convert_to_embedded_link(old_link: str) -> str:
    """
    Convert a normal Tweet link (like 'https://x.com/user/status/1234')
    into the embedded version with '?ref_src=twsrc%5Etfw'.
    """
    parsed = urlparse(old_link.strip())

    # Force domain to 'twitter.com'
    netloc = "twitter.com"

    # Parse existing query parameters
    query_params = parse_qs(parsed.query)

    # Set the ref_src param
    query_params["ref_src"] = ["twsrc%5Etfw"]

    # Rebuild the query string
    new_query = urlencode(query_params, doseq=True)

    # Construct the new URL
    new_url = urlunparse((
        parsed.scheme,
        netloc,
        parsed.path,
        parsed.params,
        new_query,
        parsed.fragment
    ))
    
    return new_url

def main():
    input_file = "old.txt"
    output_file = "new.txt"

    with open(input_file, "r", encoding="utf-8") as infile, \
         open(output_file, "w", encoding="utf-8") as outfile:
        
        # Write the first line of the JavaScript export
        outfile.write("export const allTweets = [\n")

        for line in infile:
            line = line.strip()
            if not line:
                continue  # skip empty lines
            new_link = convert_to_embedded_link(line)
            # Write in the format:   "https://twitter.com/...status/1234?ref_src=twsrc%5Etfw",
            outfile.write(f'  "{new_link}",\n')

        # Close the array
        outfile.write("]\n")

if __name__ == "__main__":
    main()
