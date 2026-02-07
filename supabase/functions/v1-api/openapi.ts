
export const openApiSpec = {
    "openapi": "3.0.0",
    "info": {
        "title": "DesignSys API",
        "description": "Programmatic access to your Design System tokens and generation capabilities.",
        "version": "1.0.0"
    },
    "servers": [
        {
            "url": "https://<project-ref>.functions.supabase.co/v1-api",
            "description": "Production Server"
        }
    ],
    "components": {
        "securitySchemes": {
            "ApiKeyAuth": {
                "type": "apiKey",
                "in": "header",
                "name": "x-api-key"
            }
        },
        "schemas": {
            "Token": {
                "type": "object",
                "properties": {
                    "id": { "type": "string" },
                    "name": { "type": "string" },
                    "value": {
                        "oneOf": [
                            { "type": "string" },
                            { "type": "object" }
                        ]
                    },
                    "token_type": { "type": "string" },
                    "path": { "type": "string" }
                }
            },
            "GenerationRequest": {
                "type": "object",
                "required": ["prompt"],
                "properties": {
                    "prompt": { "type": "string", "description": "Description of the design system to generate" },
                    "colors": { "type": "array", "items": { "type": "string" } },
                    "fontStyle": { "type": "string" }
                }
            }
        }
    },
    "security": [
        {
            "ApiKeyAuth": []
        }
    ],
    "paths": {
        "/v1/tokens": {
            "get": {
                "summary": "List Design Tokens",
                "description": "Retrieve all tokens for the authenticated Design System.",
                "responses": {
                    "200": {
                        "description": "Successful response",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "success": { "type": "boolean" },
                                        "meta": {
                                            "type": "object",
                                            "properties": {
                                                "count": { "type": "integer" }
                                            }
                                        },
                                        "data": {
                                            "type": "array",
                                            "items": { "$ref": "#/components/schemas/Token" }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "401": { "description": "Unauthorized - Invalid or missing API Key" },
                    "403": { "description": "Forbidden - Insufficient Scope (Requires tokens:read)" },
                    "429": { "description": "Too Many Requests" }
                }
            }
        },
        "/v1/generate": {
            "post": {
                "summary": "Generate Design System",
                "description": "Generate a new design system using AI.",
                "requestBody": {
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/GenerationRequest" }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Generation successful",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "success": { "type": "boolean" },
                                        "data": { "type": "object" }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
