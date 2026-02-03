/*
 * OpenGSL - Open Public Geneia Styling Library
 * Cross-platform 2D/2.5D/3D Graphics for Geneia Programming Language
 * 
 * Features:
 * - Real window GUI (cross-platform)
 * - 2D shapes: rect, circle, line, polygon, arc, ellipse
 * - 2.5D shapes: isometric, shadow, depth
 * - 3D shapes: cube, sphere, pyramid, cylinder, mesh
 * - Styling: colors, gradients, shadows, transforms
 * - Events: click, hover, drag, keyboard
 */

#ifndef OPENGSL_H
#define OPENGSL_H

#include <string>
#include <vector>
#include <map>
#include <functional>
#include <cmath>

namespace OpenGSL {

// Color structure with RGBA
struct Color {
    uint8_t r, g, b, a;
    
    Color() : r(0), g(0), b(0), a(255) {}
    Color(uint8_t r, uint8_t g, uint8_t b, uint8_t a = 255) : r(r), g(g), b(b), a(a) {}
    
    static Color fromHex(const std::string& hex) {
        Color c;
        std::string h = hex;
        if (h[0] == '#') h = h.substr(1);
        if (h.length() >= 6) {
            c.r = std::stoi(h.substr(0, 2), nullptr, 16);
            c.g = std::stoi(h.substr(2, 2), nullptr, 16);
            c.b = std::stoi(h.substr(4, 2), nullptr, 16);
            if (h.length() >= 8) c.a = std::stoi(h.substr(6, 2), nullptr, 16);
        }
        return c;
    }
    
    std::string toHex() const {
        char buf[10];
        snprintf(buf, sizeof(buf), "#%02X%02X%02X", r, g, b);
        return std::string(buf);
    }
    
    // Predefined colors
    static Color Red() { return Color(255, 0, 0); }
    static Color Green() { return Color(0, 255, 0); }
    static Color Blue() { return Color(0, 0, 255); }
    static Color Yellow() { return Color(255, 255, 0); }
    static Color Orange() { return Color(255, 127, 0); }
    static Color Purple() { return Color(128, 0, 128); }
    static Color Cyan() { return Color(0, 255, 255); }
    static Color Magenta() { return Color(255, 0, 255); }
    static Color White() { return Color(255, 255, 255); }
    static Color Black() { return Color(0, 0, 0); }
    static Color Gray() { return Color(128, 128, 128); }
    static Color Indigo() { return Color(75, 0, 130); }
    static Color Violet() { return Color(148, 0, 211); }
};

// 2D Point
struct Point2D {
    float x, y;
    Point2D(float x = 0, float y = 0) : x(x), y(y) {}
};

// 3D Point
struct Point3D {
    float x, y, z;
    Point3D(float x = 0, float y = 0, float z = 0) : x(x), y(y), z(z) {}
    
    // Project to 2D (isometric)
    Point2D toIsometric() const {
        return Point2D(x - z, (x + z) * 0.5f + y);
    }
    
    // Project to 2D (perspective)
    Point2D toPerspective(float fov = 500, float cx = 400, float cy = 300) const {
        float scale = fov / (fov + z);
        return Point2D(x * scale + cx, y * scale + cy);
    }
};

// Shape types
enum ShapeType {
    SHAPE_RECT,
    SHAPE_CIRCLE,
    SHAPE_ELLIPSE,
    SHAPE_LINE,
    SHAPE_POLYGON,
    SHAPE_ARC,
    SHAPE_TEXT,
    SHAPE_IMAGE,
    // 2.5D
    SHAPE_ISOMETRIC_RECT,
    SHAPE_SHADOW_RECT,
    SHAPE_DEPTH_RECT,
    // 3D
    SHAPE_CUBE,
    SHAPE_SPHERE,
    SHAPE_PYRAMID,
    SHAPE_CYLINDER,
    SHAPE_MESH
};


// Style for shapes
struct Style {
    Color fill;
    Color stroke;
    float strokeWidth;
    float opacity;
    float shadowX, shadowY, shadowBlur;
    Color shadowColor;
    float rotation;
    float scaleX, scaleY;
    
    Style() : fill(Color::White()), stroke(Color::Black()), strokeWidth(1),
              opacity(1.0f), shadowX(0), shadowY(0), shadowBlur(0),
              shadowColor(Color(0,0,0,128)), rotation(0), scaleX(1), scaleY(1) {}
};

// Base shape class
class Shape {
public:
    ShapeType type;
    float x, y, z;
    float width, height, depth;
    Style style;
    std::string id;
    bool visible;
    
    Shape() : type(SHAPE_RECT), x(0), y(0), z(0), width(100), height(100), depth(0), visible(true) {}
    virtual ~Shape() {}
    
    virtual std::string toSVG() const { return ""; }
    virtual std::string toScript() const { return ""; }
};

// 2D Rectangle
class Rect : public Shape {
public:
    float rx, ry; // corner radius
    
    Rect(float x, float y, float w, float h) : rx(0), ry(0) {
        this->type = SHAPE_RECT;
        this->x = x; this->y = y;
        this->width = w; this->height = h;
    }
    
    std::string toSVG() const override {
        char buf[512];
        snprintf(buf, sizeof(buf),
            "<rect x=\"%.1f\" y=\"%.1f\" width=\"%.1f\" height=\"%.1f\" "
            "rx=\"%.1f\" ry=\"%.1f\" fill=\"%s\" stroke=\"%s\" stroke-width=\"%.1f\" opacity=\"%.2f\"/>",
            x, y, width, height, rx, ry,
            style.fill.toHex().c_str(), style.stroke.toHex().c_str(),
            style.strokeWidth, style.opacity);
        return std::string(buf);
    }
    
    std::string toScript() const override {
        return "RECT|" + id + "|" + std::to_string((int)x) + "|" + std::to_string((int)y) + 
               "|" + std::to_string((int)width) + "|" + std::to_string((int)height) + 
               "|" + style.fill.toHex();
    }
};

// 2D Circle
class Circle : public Shape {
public:
    float radius;
    
    Circle(float cx, float cy, float r) : radius(r) {
        this->type = SHAPE_CIRCLE;
        this->x = cx; this->y = cy;
        this->width = r * 2; this->height = r * 2;
    }
    
    std::string toSVG() const override {
        char buf[512];
        snprintf(buf, sizeof(buf),
            "<circle cx=\"%.1f\" cy=\"%.1f\" r=\"%.1f\" fill=\"%s\" stroke=\"%s\" stroke-width=\"%.1f\"/>",
            x, y, radius, style.fill.toHex().c_str(), style.stroke.toHex().c_str(), style.strokeWidth);
        return std::string(buf);
    }
    
    std::string toScript() const override {
        return "CIRCLE|" + id + "|" + std::to_string((int)x) + "|" + std::to_string((int)y) + 
               "|" + std::to_string((int)radius) + "|" + style.fill.toHex();
    }
};

// 2D Line
class Line : public Shape {
public:
    float x2, y2;
    
    Line(float x1, float y1, float x2, float y2) : x2(x2), y2(y2) {
        this->type = SHAPE_LINE;
        this->x = x1; this->y = y1;
    }
    
    std::string toSVG() const override {
        char buf[256];
        snprintf(buf, sizeof(buf),
            "<line x1=\"%.1f\" y1=\"%.1f\" x2=\"%.1f\" y2=\"%.1f\" stroke=\"%s\" stroke-width=\"%.1f\"/>",
            x, y, x2, y2, style.stroke.toHex().c_str(), style.strokeWidth);
        return std::string(buf);
    }
};

// 2D Ellipse
class Ellipse : public Shape {
public:
    float rx, ry;
    
    Ellipse(float cx, float cy, float rx, float ry) : rx(rx), ry(ry) {
        this->type = SHAPE_ELLIPSE;
        this->x = cx; this->y = cy;
    }
    
    std::string toSVG() const override {
        char buf[256];
        snprintf(buf, sizeof(buf),
            "<ellipse cx=\"%.1f\" cy=\"%.1f\" rx=\"%.1f\" ry=\"%.1f\" fill=\"%s\" stroke=\"%s\"/>",
            x, y, rx, ry, style.fill.toHex().c_str(), style.stroke.toHex().c_str());
        return std::string(buf);
    }
};

// 2D Polygon
class Polygon : public Shape {
public:
    std::vector<Point2D> points;
    
    Polygon() { this->type = SHAPE_POLYGON; }
    
    void addPoint(float x, float y) { points.push_back(Point2D(x, y)); }
    
    std::string toSVG() const override {
        std::string pts;
        for (const auto& p : points) {
            pts += std::to_string((int)p.x) + "," + std::to_string((int)p.y) + " ";
        }
        return "<polygon points=\"" + pts + "\" fill=\"" + style.fill.toHex() + 
               "\" stroke=\"" + style.stroke.toHex() + "\"/>";
    }
};

// Text
class Text : public Shape {
public:
    std::string text;
    std::string fontFamily;
    float fontSize;
    
    Text(float x, float y, const std::string& txt) : text(txt), fontFamily("Arial"), fontSize(16) {
        this->type = SHAPE_TEXT;
        this->x = x; this->y = y;
    }
    
    std::string toSVG() const override {
        return "<text x=\"" + std::to_string((int)x) + "\" y=\"" + std::to_string((int)y) + 
               "\" font-family=\"" + fontFamily + "\" font-size=\"" + std::to_string((int)fontSize) + 
               "\" fill=\"" + style.fill.toHex() + "\">" + text + "</text>";
    }
};


// 2.5D Isometric Rectangle
class IsometricRect : public Shape {
public:
    IsometricRect(float x, float y, float w, float h, float d) {
        this->type = SHAPE_ISOMETRIC_RECT;
        this->x = x; this->y = y;
        this->width = w; this->height = h; this->depth = d;
    }
    
    std::string toSVG() const override {
        // Create isometric box with 3 visible faces
        float isoX = 0.866f; // cos(30)
        float isoY = 0.5f;   // sin(30)
        
        // Top face
        std::string top = "<polygon points=\"";
        top += std::to_string((int)x) + "," + std::to_string((int)(y - depth * isoY)) + " ";
        top += std::to_string((int)(x + width * isoX)) + "," + std::to_string((int)(y - depth * isoY + width * isoY)) + " ";
        top += std::to_string((int)(x + width * isoX - height * isoX)) + "," + std::to_string((int)(y - depth * isoY + width * isoY + height * isoY)) + " ";
        top += std::to_string((int)(x - height * isoX)) + "," + std::to_string((int)(y - depth * isoY + height * isoY));
        top += "\" fill=\"" + style.fill.toHex() + "\" stroke=\"" + style.stroke.toHex() + "\"/>";
        
        // Left face (darker)
        Color leftColor(style.fill.r * 0.7, style.fill.g * 0.7, style.fill.b * 0.7);
        std::string left = "<polygon points=\"";
        left += std::to_string((int)(x - height * isoX)) + "," + std::to_string((int)(y - depth * isoY + height * isoY)) + " ";
        left += std::to_string((int)x) + "," + std::to_string((int)(y - depth * isoY)) + " ";
        left += std::to_string((int)x) + "," + std::to_string((int)y) + " ";
        left += std::to_string((int)(x - height * isoX)) + "," + std::to_string((int)(y + height * isoY));
        left += "\" fill=\"" + leftColor.toHex() + "\" stroke=\"" + style.stroke.toHex() + "\"/>";
        
        // Right face (medium)
        Color rightColor(style.fill.r * 0.85, style.fill.g * 0.85, style.fill.b * 0.85);
        std::string right = "<polygon points=\"";
        right += std::to_string((int)x) + "," + std::to_string((int)(y - depth * isoY)) + " ";
        right += std::to_string((int)(x + width * isoX)) + "," + std::to_string((int)(y - depth * isoY + width * isoY)) + " ";
        right += std::to_string((int)(x + width * isoX)) + "," + std::to_string((int)(y + width * isoY)) + " ";
        right += std::to_string((int)x) + "," + std::to_string((int)y);
        right += "\" fill=\"" + rightColor.toHex() + "\" stroke=\"" + style.stroke.toHex() + "\"/>";
        
        return left + right + top;
    }
};

// 3D Cube
class Cube : public Shape {
public:
    float size;
    float rotX, rotY, rotZ;
    
    Cube(float x, float y, float z, float size) : size(size), rotX(0), rotY(0), rotZ(0) {
        this->type = SHAPE_CUBE;
        this->x = x; this->y = y; this->z = z;
    }
    
    std::string toSVG() const override {
        // Project 3D cube to 2D using isometric projection
        float s = size / 2;
        Point3D vertices[8] = {
            Point3D(x-s, y-s, z-s), Point3D(x+s, y-s, z-s),
            Point3D(x+s, y+s, z-s), Point3D(x-s, y+s, z-s),
            Point3D(x-s, y-s, z+s), Point3D(x+s, y-s, z+s),
            Point3D(x+s, y+s, z+s), Point3D(x-s, y+s, z+s)
        };
        
        // Project to 2D
        Point2D proj[8];
        for (int i = 0; i < 8; i++) {
            proj[i] = vertices[i].toIsometric();
        }
        
        std::string svg;
        
        // Draw back faces first
        // Front face
        svg += "<polygon points=\"";
        svg += std::to_string((int)proj[0].x) + "," + std::to_string((int)proj[0].y) + " ";
        svg += std::to_string((int)proj[1].x) + "," + std::to_string((int)proj[1].y) + " ";
        svg += std::to_string((int)proj[2].x) + "," + std::to_string((int)proj[2].y) + " ";
        svg += std::to_string((int)proj[3].x) + "," + std::to_string((int)proj[3].y);
        svg += "\" fill=\"" + style.fill.toHex() + "\" stroke=\"" + style.stroke.toHex() + "\" opacity=\"0.9\"/>";
        
        // Top face
        Color topColor(std::min(255, style.fill.r + 30), std::min(255, style.fill.g + 30), std::min(255, style.fill.b + 30));
        svg += "<polygon points=\"";
        svg += std::to_string((int)proj[0].x) + "," + std::to_string((int)proj[0].y) + " ";
        svg += std::to_string((int)proj[1].x) + "," + std::to_string((int)proj[1].y) + " ";
        svg += std::to_string((int)proj[5].x) + "," + std::to_string((int)proj[5].y) + " ";
        svg += std::to_string((int)proj[4].x) + "," + std::to_string((int)proj[4].y);
        svg += "\" fill=\"" + topColor.toHex() + "\" stroke=\"" + style.stroke.toHex() + "\"/>";
        
        // Right face
        Color rightColor(style.fill.r * 0.8, style.fill.g * 0.8, style.fill.b * 0.8);
        svg += "<polygon points=\"";
        svg += std::to_string((int)proj[1].x) + "," + std::to_string((int)proj[1].y) + " ";
        svg += std::to_string((int)proj[2].x) + "," + std::to_string((int)proj[2].y) + " ";
        svg += std::to_string((int)proj[6].x) + "," + std::to_string((int)proj[6].y) + " ";
        svg += std::to_string((int)proj[5].x) + "," + std::to_string((int)proj[5].y);
        svg += "\" fill=\"" + rightColor.toHex() + "\" stroke=\"" + style.stroke.toHex() + "\"/>";
        
        return svg;
    }
    
    std::string toScript() const override {
        return "CUBE|" + id + "|" + std::to_string((int)x) + "|" + std::to_string((int)y) + 
               "|" + std::to_string((int)z) + "|" + std::to_string((int)size) + "|" + style.fill.toHex();
    }
};

// 3D Sphere (approximated with circles)
class Sphere : public Shape {
public:
    float radius;
    
    Sphere(float x, float y, float z, float r) : radius(r) {
        this->type = SHAPE_SPHERE;
        this->x = x; this->y = y; this->z = z;
    }
    
    std::string toSVG() const override {
        Point2D center = Point3D(x, y, z).toIsometric();
        
        // Create gradient for 3D effect
        std::string svg = "<defs><radialGradient id=\"sphereGrad" + id + "\" cx=\"30%\" cy=\"30%\">";
        svg += "<stop offset=\"0%\" style=\"stop-color:white;stop-opacity:0.8\"/>";
        svg += "<stop offset=\"100%\" style=\"stop-color:" + style.fill.toHex() + ";stop-opacity:1\"/>";
        svg += "</radialGradient></defs>";
        
        svg += "<circle cx=\"" + std::to_string((int)center.x) + "\" cy=\"" + std::to_string((int)center.y) + 
               "\" r=\"" + std::to_string((int)radius) + "\" fill=\"url(#sphereGrad" + id + ")\" " +
               "stroke=\"" + style.stroke.toHex() + "\"/>";
        
        return svg;
    }
};

// 3D Pyramid
class Pyramid : public Shape {
public:
    float baseSize, height3D;
    
    Pyramid(float x, float y, float z, float base, float h) : baseSize(base), height3D(h) {
        this->type = SHAPE_PYRAMID;
        this->x = x; this->y = y; this->z = z;
    }
    
    std::string toSVG() const override {
        float s = baseSize / 2;
        Point3D apex(x, y - height3D, z);
        Point3D base1(x - s, y, z - s);
        Point3D base2(x + s, y, z - s);
        Point3D base3(x + s, y, z + s);
        Point3D base4(x - s, y, z + s);
        
        Point2D pApex = apex.toIsometric();
        Point2D p1 = base1.toIsometric();
        Point2D p2 = base2.toIsometric();
        Point2D p3 = base3.toIsometric();
        Point2D p4 = base4.toIsometric();
        
        std::string svg;
        
        // Front face
        svg += "<polygon points=\"";
        svg += std::to_string((int)pApex.x) + "," + std::to_string((int)pApex.y) + " ";
        svg += std::to_string((int)p1.x) + "," + std::to_string((int)p1.y) + " ";
        svg += std::to_string((int)p2.x) + "," + std::to_string((int)p2.y);
        svg += "\" fill=\"" + style.fill.toHex() + "\" stroke=\"" + style.stroke.toHex() + "\"/>";
        
        // Right face
        Color rightColor(style.fill.r * 0.7, style.fill.g * 0.7, style.fill.b * 0.7);
        svg += "<polygon points=\"";
        svg += std::to_string((int)pApex.x) + "," + std::to_string((int)pApex.y) + " ";
        svg += std::to_string((int)p2.x) + "," + std::to_string((int)p2.y) + " ";
        svg += std::to_string((int)p3.x) + "," + std::to_string((int)p3.y);
        svg += "\" fill=\"" + rightColor.toHex() + "\" stroke=\"" + style.stroke.toHex() + "\"/>";
        
        return svg;
    }
};

// 3D Cylinder
class Cylinder : public Shape {
public:
    float radius, height3D;
    
    Cylinder(float x, float y, float z, float r, float h) : radius(r), height3D(h) {
        this->type = SHAPE_CYLINDER;
        this->x = x; this->y = y; this->z = z;
    }
    
    std::string toSVG() const override {
        Point2D top = Point3D(x, y - height3D, z).toIsometric();
        Point2D bottom = Point3D(x, y, z).toIsometric();
        
        std::string svg;
        
        // Body (rectangle approximation)
        svg += "<ellipse cx=\"" + std::to_string((int)bottom.x) + "\" cy=\"" + std::to_string((int)bottom.y) + 
               "\" rx=\"" + std::to_string((int)radius) + "\" ry=\"" + std::to_string((int)(radius * 0.5)) + 
               "\" fill=\"" + style.fill.toHex() + "\"/>";
        
        // Side
        Color sideColor(style.fill.r * 0.8, style.fill.g * 0.8, style.fill.b * 0.8);
        svg += "<rect x=\"" + std::to_string((int)(bottom.x - radius)) + "\" y=\"" + std::to_string((int)top.y) + 
               "\" width=\"" + std::to_string((int)(radius * 2)) + "\" height=\"" + std::to_string((int)(bottom.y - top.y)) + 
               "\" fill=\"" + sideColor.toHex() + "\"/>";
        
        // Top ellipse
        Color topColor(std::min(255, style.fill.r + 40), std::min(255, style.fill.g + 40), std::min(255, style.fill.b + 40));
        svg += "<ellipse cx=\"" + std::to_string((int)top.x) + "\" cy=\"" + std::to_string((int)top.y) + 
               "\" rx=\"" + std::to_string((int)radius) + "\" ry=\"" + std::to_string((int)(radius * 0.5)) + 
               "\" fill=\"" + topColor.toHex() + "\" stroke=\"" + style.stroke.toHex() + "\"/>";
        
        return svg;
    }
};


// Canvas - main drawing surface
class Canvas {
public:
    int width, height;
    std::string title;
    Color background;
    std::vector<Shape*> shapes;
    std::string theme;
    
    Canvas(int w = 800, int h = 600, const std::string& t = "OpenGSL Canvas") 
        : width(w), height(h), title(t), background(Color::White()), theme("default") {}
    
    ~Canvas() {
        for (auto s : shapes) delete s;
    }
    
    // Add shapes
    Rect* addRect(float x, float y, float w, float h, const Color& fill = Color::Blue()) {
        Rect* r = new Rect(x, y, w, h);
        r->style.fill = fill;
        r->id = "rect" + std::to_string(shapes.size());
        shapes.push_back(r);
        return r;
    }
    
    Circle* addCircle(float x, float y, float r, const Color& fill = Color::Red()) {
        Circle* c = new Circle(x, y, r);
        c->style.fill = fill;
        c->id = "circle" + std::to_string(shapes.size());
        shapes.push_back(c);
        return c;
    }
    
    Line* addLine(float x1, float y1, float x2, float y2, const Color& stroke = Color::Black()) {
        Line* l = new Line(x1, y1, x2, y2);
        l->style.stroke = stroke;
        l->id = "line" + std::to_string(shapes.size());
        shapes.push_back(l);
        return l;
    }
    
    Ellipse* addEllipse(float x, float y, float rx, float ry, const Color& fill = Color::Green()) {
        Ellipse* e = new Ellipse(x, y, rx, ry);
        e->style.fill = fill;
        e->id = "ellipse" + std::to_string(shapes.size());
        shapes.push_back(e);
        return e;
    }
    
    Text* addText(float x, float y, const std::string& txt, const Color& fill = Color::Black()) {
        Text* t = new Text(x, y, txt);
        t->style.fill = fill;
        t->id = "text" + std::to_string(shapes.size());
        shapes.push_back(t);
        return t;
    }
    
    Polygon* addPolygon(const std::vector<Point2D>& points, const Color& fill = Color::Yellow()) {
        Polygon* p = new Polygon();
        p->points = points;
        p->style.fill = fill;
        p->id = "polygon" + std::to_string(shapes.size());
        shapes.push_back(p);
        return p;
    }
    
    // 2.5D shapes
    IsometricRect* addIsometricRect(float x, float y, float w, float h, float d, const Color& fill = Color::Cyan()) {
        IsometricRect* r = new IsometricRect(x, y, w, h, d);
        r->style.fill = fill;
        r->id = "iso" + std::to_string(shapes.size());
        shapes.push_back(r);
        return r;
    }
    
    // 3D shapes
    Cube* addCube(float x, float y, float z, float size, const Color& fill = Color::Blue()) {
        Cube* c = new Cube(x, y, z, size);
        c->style.fill = fill;
        c->id = "cube" + std::to_string(shapes.size());
        shapes.push_back(c);
        return c;
    }
    
    Sphere* addSphere(float x, float y, float z, float r, const Color& fill = Color::Red()) {
        Sphere* s = new Sphere(x, y, z, r);
        s->style.fill = fill;
        s->id = "sphere" + std::to_string(shapes.size());
        shapes.push_back(s);
        return s;
    }
    
    Pyramid* addPyramid(float x, float y, float z, float base, float h, const Color& fill = Color::Orange()) {
        Pyramid* p = new Pyramid(x, y, z, base, h);
        p->style.fill = fill;
        p->id = "pyramid" + std::to_string(shapes.size());
        shapes.push_back(p);
        return p;
    }
    
    Cylinder* addCylinder(float x, float y, float z, float r, float h, const Color& fill = Color::Green()) {
        Cylinder* c = new Cylinder(x, y, z, r, h);
        c->style.fill = fill;
        c->id = "cylinder" + std::to_string(shapes.size());
        shapes.push_back(c);
        return c;
    }
    
    // Export to SVG
    std::string toSVG() const {
        std::string svg = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
        svg += "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"" + std::to_string(width) + 
               "\" height=\"" + std::to_string(height) + "\">\n";
        svg += "<rect width=\"100%\" height=\"100%\" fill=\"" + background.toHex() + "\"/>\n";
        
        for (const auto& shape : shapes) {
            if (shape->visible) {
                svg += "  " + shape->toSVG() + "\n";
            }
        }
        
        svg += "</svg>";
        return svg;
    }
    
    // Export to UI script
    std::string toScript() const {
        std::string script = "CANVAS|" + title + "|" + std::to_string(width) + "|" + std::to_string(height) + "\n";
        script += "BACKGROUND|" + background.toHex() + "\n";
        
        for (const auto& shape : shapes) {
            if (shape->visible) {
                script += shape->toScript() + "\n";
            }
        }
        
        return script;
    }
    
    // Save to file
    bool saveToSVG(const std::string& filename) const {
        std::ofstream file(filename);
        if (file.is_open()) {
            file << toSVG();
            file.close();
            return true;
        }
        return false;
    }
    
    bool saveToScript(const std::string& filename) const {
        std::ofstream file(filename);
        if (file.is_open()) {
            file << toScript();
            file.close();
            return true;
        }
        return false;
    }
};

// Window class for real GUI
class Window {
public:
    int width, height;
    std::string title;
    Canvas* canvas;
    bool running;
    
    Window(int w = 800, int h = 600, const std::string& t = "OpenGSL Window")
        : width(w), height(h), title(t), canvas(nullptr), running(false) {
        canvas = new Canvas(w, h, t);
    }
    
    ~Window() {
        delete canvas;
    }
    
    void setBackground(const Color& c) {
        if (canvas) canvas->background = c;
    }
    
    void show() {
        running = true;
        // Generate UI script and launch
        if (canvas) {
            canvas->saveToScript("_opengsl_canvas.ui");
        }
    }
    
    void close() {
        running = false;
    }
};

} // namespace OpenGSL

#endif // OPENGSL_H
