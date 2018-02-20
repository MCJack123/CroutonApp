#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <jsoncpp/json/json.h>

std::string base64_encode(unsigned char const* bytes_to_encode, unsigned int in_len) {
  std::string ret;
  int i = 0;
  int j = 0;
  unsigned char char_array_3[3];
  unsigned char char_array_4[4];

  while (in_len--) {
    char_array_3[i++] = *(bytes_to_encode++);
    if (i == 3) {
      char_array_4[0] = (char_array_3[0] & 0xfc) >> 2;
      char_array_4[1] = ((char_array_3[0] & 0x03) << 4) + ((char_array_3[1] & 0xf0) >> 4);
      char_array_4[2] = ((char_array_3[1] & 0x0f) << 2) + ((char_array_3[2] & 0xc0) >> 6);
      char_array_4[3] = char_array_3[2] & 0x3f;

      for(i = 0; (i <4) ; i++)
        ret += base64_chars[char_array_4[i]];
      i = 0;
    }
  }

  if (i)
  {
    for(j = i; j < 3; j++)
      char_array_3[j] = '\0';

    char_array_4[0] = ( char_array_3[0] & 0xfc) >> 2;
    char_array_4[1] = ((char_array_3[0] & 0x03) << 4) + ((char_array_3[1] & 0xf0) >> 4);
    char_array_4[2] = ((char_array_3[1] & 0x0f) << 2) + ((char_array_3[2] & 0xc0) >> 6);

    for (j = 0; (j < i + 1); j++)
      ret += base64_chars[char_array_4[j]];

    while((i++ < 3))
      ret += '=';

  }

  return ret;

}

std::streampos fileSize( const char* filePath ){

    std::streampos fsize = 0;
    std::ifstream file( filePath, std::ios::binary );

    fsize = file.tellg();
    file.seekg( 0, std::ios::end );
    fsize = file.tellg() - fsize;
    file.close();

    return fsize;
}

int main(int argc, const char * argv[]) {
    if (argc < 4) {
        std::cout << "Usage: " << argv[0] << " <program name> <program path> <app name> [icon path]";
        return 1;
    }
    std::string icon;
    char* data = malloc(4096);
    if (argc > 4) {
        icon = std::string(argv[4]);
    } else {
        icon = "icon_128.png";
    }
    unsigned char* icondata = (unsigned char*)malloc(fileSize(icon.c_str()));
    Json::Value root;
    std::ifstream in;
    std::ofstream out;
    in.open(icon.c_str());
    in.read(&data, 4096);
    strcpy
    while (in.good() && !in.eof()) {
        in.read(&data, 4096);
        strcat(icondata, const_cast<const char *>(data));
    }
    in.close();
    in.open("programs.json");
    //std::stringstream pro;
    //std::string p;
    //in >> p;
    //std::cout << ":" << p << "\n";
    //pro << p;
    //pro >> root;
    in >> root;
    in.close();
    std::string id = root["id"].asString();
    if (!root.isMember(argv[1])) root["keys"].append(Json::Value(argv[1]));
    root[argv[1]] = Json::Value(argv[2]);
    out.open("programs.json");
    out << root;
    out.close();
    std::string dir("" + std::string(argv[1]) + "/");
    system(std::string("mkdir " + dir).c_str());
    Json::Value manifest;
    manifest["name"] = Json::Value(argv[3]);
    manifest["description"] = Json::Value("Crouton app wrapper");
    manifest["version"] = Json::Value("1.0");
    manifest["manifest_version"] = Json::Value(2);
    manifest["icons"] = Json::Value(Json::objectValue);
    manifest["icons"]["128"] = Json::Value("icon_128.png");
    manifest["app"] = Json::Value(Json::objectValue);
    manifest["app"]["background"] = Json::Value(Json::objectValue);
    manifest["app"]["background"]["scripts"] = Json::Value(Json::arrayValue);
    manifest["app"]["background"]["scripts"].append(Json::Value("background.js"));
    out.open(std::string(dir + "manifest.json").c_str());
    out << manifest;
    out.close();
    out.open(std::string(dir + "background.js").c_str());
    out << "var canvas = document.createElement('canvas'); var context = canvas.getContext('2d'); var img = document.createElement('img'); img.src = 'data:image/png;base64, " << base64_encode() "'; var xhr = new XMLHttpRequest(); xhr.open(\"GET\", \"http://dweet.io/dweet/for/jmw_croutonapp" << id << "?program=" << argv[1] << "\", true); xhr.setRequestHeader(\"Content-Type\", \"text/json; charset=UTF-8\"); xhr.send();";
    out.close();
    system(std::string("cp " + icon + " " + dir + "icon_128.png").c_str());
    system(std::string("crxmake --pack-extension=" + dir).c_str());
    std::cout << "programs.json has been updated, and the extension has been created as " << dir << "\b.crx.\n";
    return 0;
}
