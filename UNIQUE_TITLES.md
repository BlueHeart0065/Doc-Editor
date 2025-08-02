# 📝 Unique Document Title System

## Overview

The document editor now includes an intelligent automatic numbering system that prevents duplicate document titles. This ensures every document has a unique name while maintaining user-friendly naming conventions.

## Features

### ✨ **Automatic Numbering for New Documents**
- New documents are automatically named "Untitled Document", "Untitled Document 1", "Untitled Document 2", etc.
- The system finds the highest existing number and increments it

### 🔄 **Duplicate Prevention for Manual Titles**
- When users manually change document titles, the system prevents duplicates
- If a duplicate title is detected, it automatically appends a number
- Users are notified when their title has been modified

### 📄 **Smart Duplication Handling**
- Duplicated documents get "(Copy)" suffix with automatic numbering
- "Document (Copy)", "Document (Copy) 1", "Document (Copy) 2", etc.

## How It Works

### 1. **New Document Creation**
```javascript
// When creating a new document
POST /docs/new

// System automatically generates:
"Untitled Document"     // First document
"Untitled Document 1"   // Second document  
"Untitled Document 2"   // Third document
```

### 2. **Manual Title Changes**
```javascript
// User tries to save a title that already exists
// System automatically modifies it to be unique

Original attempt: "My Project"
System saves as:  "My Project 1" (if "My Project" exists)
```

### 3. **Document Duplication**
```javascript
// When duplicating a document titled "Important Notes"
POST /docs/:id/duplicate

// System creates:
"Important Notes (Copy)"     // First duplicate
"Important Notes (Copy) 1"   // Second duplicate
"Important Notes (Copy) 2"   // Third duplicate
```

## Technical Implementation

### **Core Algorithm**
The `generateUniqueTitle()` function:

1. **Checks if base title exists** - If not, returns the original title
2. **Finds all similar titles** - Uses regex to match numbered variations
3. **Determines highest number** - Finds the maximum existing number
4. **Generates next number** - Returns `baseTitle ${maxNumber + 1}`

### **Regex Pattern**
```javascript
// Matches titles like:
// "Untitled Document"
// "Untitled Document 1" 
// "Untitled Document 25"
const pattern = /^BaseTitle( (\d+))?$/i
```

### **Database Efficiency**
- Uses MongoDB regex queries for pattern matching
- Sorts results for efficient number detection
- Excludes current document when checking for duplicates

## User Experience

### **Transparent Operation**
- Users don't need to think about numbering
- System handles everything automatically
- Clear notifications when titles are modified

### **Intuitive Naming**
- Follows common software conventions
- Numbers start from 1 (not 0) for user-friendliness
- Maintains original title readability

### **Real-time Feedback**
- Save indicators show when titles are modified
- Warning notifications explain automatic changes
- Users can see the final title immediately

## Examples

### **Scenario 1: Multiple New Documents**
```
User Action: Create 5 new documents
System Result:
- "Untitled Document"
- "Untitled Document 1"  
- "Untitled Document 2"
- "Untitled Document 3"
- "Untitled Document 4"
```

### **Scenario 2: Custom Title Conflicts**
```
Existing: "Project Plan"
User types: "Project Plan"
System saves: "Project Plan 1"
User notification: "Title updated to prevent duplicates"
```

### **Scenario 3: Complex Duplication**
```
Original: "Meeting Notes"
Existing duplicates: "Meeting Notes (Copy)", "Meeting Notes (Copy) 1"
New duplicate becomes: "Meeting Notes (Copy) 2"
```

## Error Handling

### **Fallback Mechanism**
If the numbering system fails for any reason, the system falls back to timestamp-based naming:
```javascript
`${baseTitle} ${Date.now()}`
// Example: "Untitled Document 1641234567890"
```

### **Graceful Degradation**
- System continues to work even if regex fails
- Database errors don't prevent document creation
- Users always get a unique title, even if not perfectly formatted

## Benefits

### **For Users**
- ✅ Never lose documents due to name conflicts
- ✅ Clear, predictable naming conventions
- ✅ No manual numbering required
- ✅ Transparent operation

### **For System**
- ✅ Prevents database conflicts
- ✅ Maintains data integrity
- ✅ Reduces user confusion
- ✅ Improves overall reliability

## Configuration

The system is fully automatic and requires no configuration. However, developers can modify:

- **Base title for new documents** (currently "Untitled Document")
- **Copy suffix format** (currently "(Copy)")
- **Numbering format** (currently space + number)
- **Fallback naming strategy**

## Testing

Run the test script to see the system in action:
```bash
node test-unique-titles.js
```

This will demonstrate:
- Multiple untitled document creation
- Custom title numbering
- Duplication with copy suffix numbering

---

**This feature ensures that your document editor provides a professional, conflict-free experience that users can rely on without thinking about naming complexity.**