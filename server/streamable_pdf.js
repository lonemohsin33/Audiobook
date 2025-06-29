const fs = require('fs');

try {
  // Read file synchronously
  const data = fs.readFileSync('output.txt', 'utf8');
//   console.log('File content:', data);
  console.log(typeof data)
  let content_found = data.search("\nCONTENTS\n")
  console.log(content_found)
  console.log(data.slice(391, 392) == '\n')
  chapter_list = extract_all_chapters(content_found+ "CONTENTS\n".length, data)
  fs.writeFileSync('chapters.txt', JSON.stringify(chapter_list), (err)=>{
    if (err){
      return err
    }
  })
  console.log(chapter_list.length)

  
} catch (err) {
  console.error('Error reading file:', err);
}


function extract_all_chapters(content_string_start, data) {
  const content = data.slice(content_string_start);
  const lines = content.trim().split('\n');
  const chapterRegex = /^(\d+)\.\s+(.+)$/;

  const chapters = [];
  for (const line of lines) {
  const trimmed = line.trim();

  // Skip empty lines (e.g., just "\n")
  if (trimmed === '') {
    continue;
  }

  const match = trimmed.match(chapterRegex);

  if (match) {
    const chapterNumber = match[1];
    const chapterTitle = match[2];
    chapters.push(`${chapterNumber}. ${chapterTitle}`);
  } else {
    console.log('❌ Mismatch detected. Stopping at line:', line);
    break;
  }
  }



  return chapters;
}
