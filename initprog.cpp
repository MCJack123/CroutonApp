#include <fstream>
#include <string>
#include <jsoncpp/json/json.h>
#include <stdint.h>
#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include <string.h>
#include <time.h>

std::string paddedHex(uint16_t hex) {
    //Get length of hex.
    int dlen = floor(log((int)hex) / log(16)) + 1;
    printf("%d", dlen);
    //Find how many leading zeros we need.
    int dpad = 4 - dlen;
    //Our final hex code.
    char fhex[] = "0000";
    char shex[5];
    //Convert hex to a string.
    sprintf(shex, "%x", hex);
    //Copy shex to fhex, using dpad as a memory offset.
    memcpy(fhex+dpad, shex, dlen);
    return std::string(fhex);
}

int main() {
    std::ofstream out;
    Json::Value root;
    srand(time(NULL));
    uint16_t r = (uint16_t)(rand() % 65536);
    std::string hex = paddedHex(r);
    printf("done rand: %u, %s\n", r, hex.c_str());
    root["keys"] = Json::Value(Json::arrayValue);
    root["id"] = Json::Value(hex);
    printf("writing out\n");
    out.open("programs.json");
    out << root;
    out.close();
    return 0;
}
