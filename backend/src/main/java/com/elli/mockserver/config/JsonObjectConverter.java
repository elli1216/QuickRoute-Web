package com.elli.mockserver.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class JsonObjectConverter implements AttributeConverter<Object, String> {

    private static final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(Object attribute) {
        if (attribute == null) return null;
        try {
            return mapper.writeValueAsString(attribute);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize responseBody", e);
        }
    }

    @Override
    public Object convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        try {
            return mapper.readValue(dbData, Object.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to deserialize responseBody", e);
        }
    }
}
