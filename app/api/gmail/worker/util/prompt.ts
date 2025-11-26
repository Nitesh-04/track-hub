export const applicationPrompt = `

Extract job application details from the email body.
Return JSON:

{
    companyName   String
    stipend       Int?
    ctc           Int?
    role          String
    location      String
    link          String?
}


Company & Role and location are mandatory.
If provided as a table, read the row with column names like "Company", "Profile", "CTC".
Do not hallucinate values.
If any field except mandatory is missing, return an empty string for that field only if schema is marked as ?.

Return only the JSON object with correct datatype. Do not include any additional text.
`;


export const roundPrompt = `

Extract Round details from the email body.

Return JSON:

{
    companyName   String
    roundTitle    String     (E.g., "Technical Interview",  "Coding Assessment")
    roundDateTime DateTime
    venue         String
    roundLink     String?
    status        "upcoming"
}


Company & Round details and location are mandatory.

If provided as a table, read the row with column names like 
Do not hallucinate values.
If any field except mandatory is missing, return an empty string for that field only if schema is marked as ?.

Return only the JSON object with correct datatype. Do not include any additional text.
`;

