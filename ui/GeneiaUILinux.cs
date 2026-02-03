using System;
using System.IO;
using System.Collections.Generic;
using Gtk;
using Gdk;
using Cairo;

namespace GeneiaUI
{
    // Real GTK Window GUI with OpenGSL graphics support
    public class GeneiaUILinux
    {
        private static Gtk.Window? mainWindow = null;
        private static DrawingArea? canvas = null;
        private static List<ShapeData> shapes = new List<ShapeData>();
        private static string windowTitle = "Geneia Application";
        private static int windowWidth = 800;
        private static int windowHeight = 600;
        private static RGBA backgroundColor = new RGBA { Red = 1, Green = 1, Blue = 1, Alpha = 1 };
        private static string currentColor = "#3498db";
        private static bool isCanvas = false;
        
        class ShapeData
        {
            public string Type { get; set; } = "";
            public string Name { get; set; } = "";
            public double X { get; set; }
            public double Y { get; set; }
            public double Z { get; set; }
            public double Width { get; set; }
            public double Height { get; set; }
            public double Depth { get; set; }
            public double Radius { get; set; }
            public string Color { get; set; } = "#3498db";
            public string Text { get; set; } = "";
        }
        
        static void Main(string[] args)
        {
            if (args.Length == 0)
            {
                Console.WriteLine("Usage: GeneiaUILinux <ui_script_file>");
                return;
            }
            
            string scriptFile = args[0];
            if (!File.Exists(scriptFile))
            {
                Console.WriteLine($"Error: File not found: {scriptFile}");
                return;
            }
            
            Application.Init();
            
            // Parse UI script
            ParseUIScript(scriptFile);
            
            // Create main window
            mainWindow = new Gtk.Window(windowTitle);
            mainWindow.SetDefaultSize(windowWidth, windowHeight);
            mainWindow.SetPosition(WindowPosition.Center);
            mainWindow.DeleteEvent += (o, e) => Application.Quit();
            
            if (isCanvas)
            {
                // OpenGSL Canvas mode - use DrawingArea
                canvas = new DrawingArea();
                canvas.Drawn += OnDraw;
                mainWindow.Add(canvas);
            }
            else
            {
                // GeneiaUI mode - use Fixed container with widgets
                CreateWidgetUI(scriptFile);
            }
            
            mainWindow.ShowAll();
            Application.Run();
        }

        static RGBA ParseColor(string hex)
        {
            RGBA color = new RGBA();
            hex = hex.TrimStart('#');
            if (hex.Length >= 6)
            {
                color.Red = Convert.ToInt32(hex.Substring(0, 2), 16) / 255.0;
                color.Green = Convert.ToInt32(hex.Substring(2, 2), 16) / 255.0;
                color.Blue = Convert.ToInt32(hex.Substring(4, 2), 16) / 255.0;
                color.Alpha = 1.0;
            }
            return color;
        }
        
        static void ParseUIScript(string scriptFile)
        {
            string[] lines = File.ReadAllLines(scriptFile);
            
            foreach (string line in lines)
            {
                string trimmed = line.Trim();
                if (string.IsNullOrEmpty(trimmed) || trimmed.StartsWith("//")) continue;
                
                string[] parts = trimmed.Split('|');
                if (parts.Length < 1) continue;
                
                string cmd = parts[0];
                
                switch (cmd)
                {
                    case "CANVAS":
                        isCanvas = true;
                        windowTitle = parts.Length > 1 ? parts[1] : "OpenGSL Canvas";
                        windowWidth = parts.Length > 2 ? int.Parse(parts[2]) : 800;
                        windowHeight = parts.Length > 3 ? int.Parse(parts[3]) : 600;
                        break;
                    case "WINDOW":
                        windowTitle = parts.Length > 1 ? parts[1] : "Geneia Application";
                        windowWidth = parts.Length > 2 ? int.Parse(parts[2]) : 800;
                        windowHeight = parts.Length > 3 ? int.Parse(parts[3]) : 600;
                        break;
                    case "BACKGROUND":
                        if (parts.Length > 1) backgroundColor = ParseColor(parts[1]);
                        break;
                    case "COLOR":
                        if (parts.Length > 1) currentColor = parts[1];
                        break;
                    case "RECT":
                        shapes.Add(new ShapeData {
                            Type = "RECT",
                            Name = parts.Length > 1 ? parts[1] : "rect",
                            X = parts.Length > 2 ? double.Parse(parts[2]) : 0,
                            Y = parts.Length > 3 ? double.Parse(parts[3]) : 0,
                            Width = parts.Length > 4 ? double.Parse(parts[4]) : 100,
                            Height = parts.Length > 5 ? double.Parse(parts[5]) : 100,
                            Color = parts.Length > 6 ? parts[6] : currentColor
                        });
                        break;
                    case "CIRCLE":
                        shapes.Add(new ShapeData {
                            Type = "CIRCLE",
                            Name = parts.Length > 1 ? parts[1] : "circle",
                            X = parts.Length > 2 ? double.Parse(parts[2]) : 0,
                            Y = parts.Length > 3 ? double.Parse(parts[3]) : 0,
                            Radius = parts.Length > 4 ? double.Parse(parts[4]) : 50,
                            Color = parts.Length > 5 ? parts[5] : currentColor
                        });
                        break;
                    case "ELLIPSE":
                        shapes.Add(new ShapeData {
                            Type = "ELLIPSE",
                            Name = parts.Length > 1 ? parts[1] : "ellipse",
                            X = parts.Length > 2 ? double.Parse(parts[2]) : 0,
                            Y = parts.Length > 3 ? double.Parse(parts[3]) : 0,
                            Width = parts.Length > 4 ? double.Parse(parts[4]) : 50,
                            Height = parts.Length > 5 ? double.Parse(parts[5]) : 30,
                            Color = parts.Length > 6 ? parts[6] : currentColor
                        });
                        break;
                    case "LINE":
                        shapes.Add(new ShapeData {
                            Type = "LINE",
                            Name = parts.Length > 1 ? parts[1] : "line",
                            X = parts.Length > 2 ? double.Parse(parts[2]) : 0,
                            Y = parts.Length > 3 ? double.Parse(parts[3]) : 0,
                            Width = parts.Length > 4 ? double.Parse(parts[4]) : 100,
                            Height = parts.Length > 5 ? double.Parse(parts[5]) : 100,
                            Color = parts.Length > 6 ? parts[6] : currentColor
                        });
                        break;
                    case "TEXT":
                        shapes.Add(new ShapeData {
                            Type = "TEXT",
                            Name = parts.Length > 1 ? parts[1] : "text",
                            X = parts.Length > 2 ? double.Parse(parts[2]) : 0,
                            Y = parts.Length > 3 ? double.Parse(parts[3]) : 0,
                            Text = parts.Length > 4 ? parts[4] : "Text",
                            Color = parts.Length > 5 ? parts[5] : currentColor
                        });
                        break;
                    case "ISO":
                        shapes.Add(new ShapeData {
                            Type = "ISO",
                            Name = parts.Length > 1 ? parts[1] : "iso",
                            X = parts.Length > 2 ? double.Parse(parts[2]) : 0,
                            Y = parts.Length > 3 ? double.Parse(parts[3]) : 0,
                            Width = parts.Length > 4 ? double.Parse(parts[4]) : 100,
                            Height = parts.Length > 5 ? double.Parse(parts[5]) : 100,
                            Depth = parts.Length > 6 ? double.Parse(parts[6]) : 50,
                            Color = parts.Length > 7 ? parts[7] : currentColor
                        });
                        break;
                    case "CUBE":
                        shapes.Add(new ShapeData {
                            Type = "CUBE",
                            Name = parts.Length > 1 ? parts[1] : "cube",
                            X = parts.Length > 2 ? double.Parse(parts[2]) : 0,
                            Y = parts.Length > 3 ? double.Parse(parts[3]) : 0,
                            Z = parts.Length > 4 ? double.Parse(parts[4]) : 0,
                            Width = parts.Length > 5 ? double.Parse(parts[5]) : 100,
                            Color = parts.Length > 6 ? parts[6] : currentColor
                        });
                        break;
                    case "SPHERE":
                        shapes.Add(new ShapeData {
                            Type = "SPHERE",
                            Name = parts.Length > 1 ? parts[1] : "sphere",
                            X = parts.Length > 2 ? double.Parse(parts[2]) : 0,
                            Y = parts.Length > 3 ? double.Parse(parts[3]) : 0,
                            Z = parts.Length > 4 ? double.Parse(parts[4]) : 0,
                            Radius = parts.Length > 5 ? double.Parse(parts[5]) : 50,
                            Color = parts.Length > 6 ? parts[6] : currentColor
                        });
                        break;
                    case "PYRAMID":
                        shapes.Add(new ShapeData {
                            Type = "PYRAMID",
                            Name = parts.Length > 1 ? parts[1] : "pyramid",
                            X = parts.Length > 2 ? double.Parse(parts[2]) : 0,
                            Y = parts.Length > 3 ? double.Parse(parts[3]) : 0,
                            Z = parts.Length > 4 ? double.Parse(parts[4]) : 0,
                            Width = parts.Length > 5 ? double.Parse(parts[5]) : 100,
                            Height = parts.Length > 6 ? double.Parse(parts[6]) : 150,
                            Color = parts.Length > 7 ? parts[7] : currentColor
                        });
                        break;
                    case "CYLINDER":
                        shapes.Add(new ShapeData {
                            Type = "CYLINDER",
                            Name = parts.Length > 1 ? parts[1] : "cylinder",
                            X = parts.Length > 2 ? double.Parse(parts[2]) : 0,
                            Y = parts.Length > 3 ? double.Parse(parts[3]) : 0,
                            Z = parts.Length > 4 ? double.Parse(parts[4]) : 0,
                            Radius = parts.Length > 5 ? double.Parse(parts[5]) : 50,
                            Height = parts.Length > 6 ? double.Parse(parts[6]) : 100,
                            Color = parts.Length > 7 ? parts[7] : currentColor
                        });
                        break;
                    case "APPLE":
                        shapes.Add(new ShapeData {
                            Type = "APPLE",
                            Name = parts.Length > 1 ? parts[1] : "apple",
                            X = parts.Length > 2 ? double.Parse(parts[2]) : 0,
                            Y = parts.Length > 3 ? double.Parse(parts[3]) : 0,
                            Z = parts.Length > 4 ? double.Parse(parts[4]) : 0,
                            Width = parts.Length > 5 ? double.Parse(parts[5]) : 80,
                            Color = parts.Length > 6 ? parts[6] : currentColor
                        });
                        break;
                    case "PIZZA":
                        shapes.Add(new ShapeData {
                            Type = "PIZZA",
                            Name = parts.Length > 1 ? parts[1] : "pizza",
                            X = parts.Length > 2 ? double.Parse(parts[2]) : 0,
                            Y = parts.Length > 3 ? double.Parse(parts[3]) : 0,
                            Z = parts.Length > 4 ? double.Parse(parts[4]) : 0,
                            Width = parts.Length > 5 ? double.Parse(parts[5]) : 80,
                            Color = parts.Length > 6 ? parts[6] : currentColor
                        });
                        break;
                    case "LABEL":
                        shapes.Add(new ShapeData {
                            Type = "LABEL",
                            Name = parts.Length > 1 ? parts[1] : "label",
                            Text = parts.Length > 2 ? parts[2] : "Label",
                            X = parts.Length > 3 ? double.Parse(parts[3]) : 0,
                            Y = parts.Length > 4 ? double.Parse(parts[4]) : 0,
                            Color = currentColor
                        });
                        break;
                    case "BUTTON":
                        shapes.Add(new ShapeData {
                            Type = "BUTTON",
                            Name = parts.Length > 1 ? parts[1] : "button",
                            Text = parts.Length > 2 ? parts[2] : "Button",
                            X = parts.Length > 3 ? double.Parse(parts[3]) : 0,
                            Y = parts.Length > 4 ? double.Parse(parts[4]) : 0,
                            Width = parts.Length > 5 ? double.Parse(parts[5]) : 100,
                            Height = parts.Length > 6 ? double.Parse(parts[6]) : 30,
                            Color = currentColor
                        });
                        break;
                }
            }
        }

        static void OnDraw(object sender, DrawnArgs args)
        {
            Context cr = args.Cr;
            
            // Background
            cr.SetSourceRGBA(backgroundColor.Red, backgroundColor.Green, backgroundColor.Blue, backgroundColor.Alpha);
            cr.Paint();
            
            // Draw all shapes
            foreach (var shape in shapes)
            {
                RGBA color = ParseColor(shape.Color);
                cr.SetSourceRGBA(color.Red, color.Green, color.Blue, color.Alpha);
                
                switch (shape.Type)
                {
                    case "RECT":
                        cr.Rectangle(shape.X, shape.Y, shape.Width, shape.Height);
                        cr.Fill();
                        break;
                        
                    case "CIRCLE":
                        cr.Arc(shape.X, shape.Y, shape.Radius, 0, 2 * Math.PI);
                        cr.Fill();
                        break;
                        
                    case "ELLIPSE":
                        cr.Save();
                        cr.Translate(shape.X, shape.Y);
                        cr.Scale(shape.Width, shape.Height);
                        cr.Arc(0, 0, 1, 0, 2 * Math.PI);
                        cr.Restore();
                        cr.Fill();
                        break;
                        
                    case "LINE":
                        cr.LineWidth = 2;
                        cr.MoveTo(shape.X, shape.Y);
                        cr.LineTo(shape.Width, shape.Height);
                        cr.Stroke();
                        break;
                        
                    case "TEXT":
                        cr.SelectFontFace("Sans", FontSlant.Normal, FontWeight.Bold);
                        cr.SetFontSize(20);
                        cr.MoveTo(shape.X, shape.Y);
                        cr.ShowText(shape.Text);
                        break;
                        
                    case "ISO":
                        DrawIsometric(cr, shape);
                        break;
                        
                    case "CUBE":
                        DrawCube(cr, shape);
                        break;
                        
                    case "SPHERE":
                        DrawSphere(cr, shape);
                        break;
                        
                    case "PYRAMID":
                        DrawPyramid(cr, shape);
                        break;
                        
                    case "CYLINDER":
                        DrawCylinder(cr, shape);
                        break;
                        
                    case "APPLE":
                        DrawApple(cr, shape);
                        break;
                        
                    case "PIZZA":
                        DrawPizza(cr, shape);
                        break;
                        
                    case "LABEL":
                        cr.SelectFontFace("Sans", FontSlant.Normal, FontWeight.Bold);
                        cr.SetFontSize(16);
                        cr.MoveTo(shape.X, shape.Y + 20);
                        cr.ShowText("● " + shape.Text);
                        break;
                        
                    case "BUTTON":
                        // Button background
                        cr.Rectangle(shape.X, shape.Y, shape.Width, shape.Height);
                        cr.Fill();
                        // Button text
                        cr.SetSourceRGBA(1, 1, 1, 1);
                        cr.SelectFontFace("Sans", FontSlant.Normal, FontWeight.Bold);
                        cr.SetFontSize(14);
                        cr.MoveTo(shape.X + 10, shape.Y + shape.Height / 2 + 5);
                        cr.ShowText(shape.Text);
                        break;
                }
            }
        }
        
        static void DrawIsometric(Context cr, ShapeData shape)
        {
            RGBA color = ParseColor(shape.Color);
            double isoX = 0.866; // cos(30)
            double isoY = 0.5;   // sin(30)
            
            double x = shape.X, y = shape.Y;
            double w = shape.Width, h = shape.Height, d = shape.Depth;
            
            // Top face (brightest)
            cr.SetSourceRGBA(Math.Min(1, color.Red * 1.2), Math.Min(1, color.Green * 1.2), Math.Min(1, color.Blue * 1.2), 1);
            cr.MoveTo(x, y - d * isoY);
            cr.LineTo(x + w * isoX, y - d * isoY + w * isoY);
            cr.LineTo(x + w * isoX - h * isoX, y - d * isoY + w * isoY + h * isoY);
            cr.LineTo(x - h * isoX, y - d * isoY + h * isoY);
            cr.ClosePath();
            cr.Fill();
            
            // Left face (darkest)
            cr.SetSourceRGBA(color.Red * 0.6, color.Green * 0.6, color.Blue * 0.6, 1);
            cr.MoveTo(x - h * isoX, y - d * isoY + h * isoY);
            cr.LineTo(x, y - d * isoY);
            cr.LineTo(x, y);
            cr.LineTo(x - h * isoX, y + h * isoY);
            cr.ClosePath();
            cr.Fill();
            
            // Right face (medium)
            cr.SetSourceRGBA(color.Red * 0.8, color.Green * 0.8, color.Blue * 0.8, 1);
            cr.MoveTo(x, y - d * isoY);
            cr.LineTo(x + w * isoX, y - d * isoY + w * isoY);
            cr.LineTo(x + w * isoX, y + w * isoY);
            cr.LineTo(x, y);
            cr.ClosePath();
            cr.Fill();
        }
        
        static void DrawCube(Context cr, ShapeData shape)
        {
            RGBA color = ParseColor(shape.Color);
            double size = shape.Width;
            double x = shape.X, y = shape.Y;
            
            // Simple 3D cube projection
            double offset = size * 0.4;
            
            // Back face
            cr.SetSourceRGBA(color.Red * 0.5, color.Green * 0.5, color.Blue * 0.5, 1);
            cr.Rectangle(x + offset, y - offset, size, size);
            cr.Fill();
            
            // Top face
            cr.SetSourceRGBA(Math.Min(1, color.Red * 1.1), Math.Min(1, color.Green * 1.1), Math.Min(1, color.Blue * 1.1), 1);
            cr.MoveTo(x, y);
            cr.LineTo(x + offset, y - offset);
            cr.LineTo(x + offset + size, y - offset);
            cr.LineTo(x + size, y);
            cr.ClosePath();
            cr.Fill();
            
            // Right face
            cr.SetSourceRGBA(color.Red * 0.7, color.Green * 0.7, color.Blue * 0.7, 1);
            cr.MoveTo(x + size, y);
            cr.LineTo(x + offset + size, y - offset);
            cr.LineTo(x + offset + size, y - offset + size);
            cr.LineTo(x + size, y + size);
            cr.ClosePath();
            cr.Fill();
            
            // Front face
            cr.SetSourceRGBA(color.Red, color.Green, color.Blue, 1);
            cr.Rectangle(x, y, size, size);
            cr.Fill();
        }
        
        static void DrawSphere(Context cr, ShapeData shape)
        {
            RGBA color = ParseColor(shape.Color);
            double x = shape.X, y = shape.Y, r = shape.Radius;
            
            // Create gradient for 3D effect
            using (var gradient = new Cairo.RadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r))
            {
                gradient.AddColorStop(0, new Cairo.Color(1, 1, 1, 0.8));
                gradient.AddColorStop(0.5, new Cairo.Color(color.Red, color.Green, color.Blue, 1));
                gradient.AddColorStop(1, new Cairo.Color(color.Red * 0.3, color.Green * 0.3, color.Blue * 0.3, 1));
                
                cr.SetSource(gradient);
                cr.Arc(x, y, r, 0, 2 * Math.PI);
                cr.Fill();
            }
        }
        
        static void DrawPyramid(Context cr, ShapeData shape)
        {
            RGBA color = ParseColor(shape.Color);
            double x = shape.X, y = shape.Y;
            double baseSize = shape.Width, height = shape.Height;
            
            // Front face
            cr.SetSourceRGBA(color.Red, color.Green, color.Blue, 1);
            cr.MoveTo(x, y - height);
            cr.LineTo(x - baseSize / 2, y);
            cr.LineTo(x + baseSize / 2, y);
            cr.ClosePath();
            cr.Fill();
            
            // Right face (darker)
            cr.SetSourceRGBA(color.Red * 0.6, color.Green * 0.6, color.Blue * 0.6, 1);
            cr.MoveTo(x, y - height);
            cr.LineTo(x + baseSize / 2, y);
            cr.LineTo(x + baseSize / 2 + baseSize * 0.3, y - baseSize * 0.2);
            cr.ClosePath();
            cr.Fill();
        }
        
        static void DrawCylinder(Context cr, ShapeData shape)
        {
            RGBA color = ParseColor(shape.Color);
            double x = shape.X, y = shape.Y;
            double r = shape.Radius, h = shape.Height;
            
            // Body
            cr.SetSourceRGBA(color.Red * 0.8, color.Green * 0.8, color.Blue * 0.8, 1);
            cr.Rectangle(x - r, y - h, r * 2, h);
            cr.Fill();
            
            // Bottom ellipse
            cr.SetSourceRGBA(color.Red * 0.6, color.Green * 0.6, color.Blue * 0.6, 1);
            cr.Save();
            cr.Translate(x, y);
            cr.Scale(r, r * 0.3);
            cr.Arc(0, 0, 1, 0, 2 * Math.PI);
            cr.Restore();
            cr.Fill();
            
            // Top ellipse
            cr.SetSourceRGBA(Math.Min(1, color.Red * 1.2), Math.Min(1, color.Green * 1.2), Math.Min(1, color.Blue * 1.2), 1);
            cr.Save();
            cr.Translate(x, y - h);
            cr.Scale(r, r * 0.3);
            cr.Arc(0, 0, 1, 0, 2 * Math.PI);
            cr.Restore();
            cr.Fill();
        }
        
        static void DrawApple(Context cr, ShapeData shape)
        {
            RGBA color = ParseColor(shape.Color);
            double x = shape.X, y = shape.Y;
            double size = shape.Width;
            
            // Apple body - main sphere with indent at top
            // Left half of apple body
            using (var gradient = new Cairo.RadialGradient(x - size * 0.2, y - size * 0.2, size * 0.1, x, y, size))
            {
                gradient.AddColorStop(0, new Cairo.Color(1, 1, 1, 0.6));
                gradient.AddColorStop(0.3, new Cairo.Color(color.Red, color.Green, color.Blue, 1));
                gradient.AddColorStop(1, new Cairo.Color(color.Red * 0.4, color.Green * 0.2, color.Blue * 0.2, 1));
                
                cr.SetSource(gradient);
                
                // Draw apple shape using bezier curves
                cr.MoveTo(x, y - size * 0.9);  // Top center (indent)
                
                // Left side curve
                cr.CurveTo(x - size * 0.6, y - size * 0.8,   // control point 1
                           x - size * 1.0, y - size * 0.3,   // control point 2
                           x - size * 0.8, y + size * 0.3);  // end point
                
                // Bottom left curve
                cr.CurveTo(x - size * 0.6, y + size * 0.8,
                           x - size * 0.2, y + size * 1.0,
                           x, y + size * 0.9);
                
                // Bottom right curve
                cr.CurveTo(x + size * 0.2, y + size * 1.0,
                           x + size * 0.6, y + size * 0.8,
                           x + size * 0.8, y + size * 0.3);
                
                // Right side curve
                cr.CurveTo(x + size * 1.0, y - size * 0.3,
                           x + size * 0.6, y - size * 0.8,
                           x, y - size * 0.9);
                
                cr.ClosePath();
                cr.Fill();
            }
            
            // Apple indent at top (darker area)
            cr.SetSourceRGBA(color.Red * 0.5, color.Green * 0.3, color.Blue * 0.3, 0.6);
            cr.Arc(x, y - size * 0.75, size * 0.25, 0, Math.PI);
            cr.Fill();
            
            // Stem
            cr.SetSourceRGBA(0.4, 0.25, 0.1, 1);  // Brown color
            cr.MoveTo(x - size * 0.05, y - size * 0.85);
            cr.LineTo(x + size * 0.05, y - size * 0.85);
            cr.LineTo(x + size * 0.03, y - size * 1.15);
            cr.LineTo(x - size * 0.03, y - size * 1.15);
            cr.ClosePath();
            cr.Fill();
            
            // Leaf
            cr.SetSourceRGBA(0.2, 0.6, 0.2, 1);  // Green color
            cr.MoveTo(x + size * 0.05, y - size * 1.0);
            cr.CurveTo(x + size * 0.3, y - size * 1.3,
                       x + size * 0.5, y - size * 1.1,
                       x + size * 0.4, y - size * 0.9);
            cr.CurveTo(x + size * 0.3, y - size * 0.95,
                       x + size * 0.15, y - size * 0.95,
                       x + size * 0.05, y - size * 1.0);
            cr.Fill();
            
            // Leaf vein
            cr.SetSourceRGBA(0.15, 0.4, 0.15, 1);
            cr.LineWidth = 1;
            cr.MoveTo(x + size * 0.08, y - size * 1.0);
            cr.CurveTo(x + size * 0.2, y - size * 1.1,
                       x + size * 0.3, y - size * 1.05,
                       x + size * 0.35, y - size * 0.95);
            cr.Stroke();
            
            // Highlight on apple
            cr.SetSourceRGBA(1, 1, 1, 0.3);
            cr.Arc(x - size * 0.3, y - size * 0.2, size * 0.2, 0, 2 * Math.PI);
            cr.Fill();
        }

        static void DrawPizza(Context cr, ShapeData shape)
        {
            RGBA color = ParseColor(shape.Color);
            double x = shape.X, y = shape.Y;
            double size = shape.Width;
            
            // Pizza base (crust) - outer circle
            cr.SetSourceRGBA(0.85, 0.65, 0.35, 1);  // Crust color
            cr.Arc(x, y, size, 0, 2 * Math.PI);
            cr.Fill();
            
            // Pizza sauce - inner circle
            cr.SetSourceRGBA(0.8, 0.2, 0.1, 1);  // Tomato sauce red
            cr.Arc(x, y, size * 0.88, 0, 2 * Math.PI);
            cr.Fill();
            
            // Cheese layer with gradient
            using (var gradient = new Cairo.RadialGradient(x - size * 0.2, y - size * 0.2, size * 0.1, x, y, size * 0.85))
            {
                gradient.AddColorStop(0, new Cairo.Color(1.0, 0.95, 0.6, 1));  // Light cheese
                gradient.AddColorStop(0.5, new Cairo.Color(color.Red, color.Green, color.Blue, 1));
                gradient.AddColorStop(1, new Cairo.Color(0.9, 0.75, 0.3, 1));  // Golden cheese
                
                cr.SetSource(gradient);
                cr.Arc(x, y, size * 0.85, 0, 2 * Math.PI);
                cr.Fill();
            }
            
            // Pepperoni toppings
            cr.SetSourceRGBA(0.6, 0.15, 0.1, 1);  // Dark red pepperoni
            double[] pepX = { 0.3, -0.4, 0.5, -0.2, 0.1, -0.5, 0.4, -0.1 };
            double[] pepY = { -0.4, 0.3, 0.2, -0.5, 0.4, -0.2, -0.1, 0.1 };
            for (int i = 0; i < pepX.Length; i++)
            {
                cr.Arc(x + size * pepX[i], y + size * pepY[i], size * 0.12, 0, 2 * Math.PI);
                cr.Fill();
                // Pepperoni highlight
                cr.SetSourceRGBA(0.7, 0.2, 0.15, 1);
                cr.Arc(x + size * pepX[i] - size * 0.03, y + size * pepY[i] - size * 0.03, size * 0.06, 0, 2 * Math.PI);
                cr.Fill();
                cr.SetSourceRGBA(0.6, 0.15, 0.1, 1);
            }
            
            // Green pepper pieces
            cr.SetSourceRGBA(0.2, 0.6, 0.2, 1);  // Green
            cr.Arc(x + size * 0.6, y - size * 0.1, size * 0.08, 0, 2 * Math.PI);
            cr.Fill();
            cr.Arc(x - size * 0.55, y + size * 0.5, size * 0.07, 0, 2 * Math.PI);
            cr.Fill();
            cr.Arc(x + size * 0.2, y + size * 0.55, size * 0.06, 0, 2 * Math.PI);
            cr.Fill();
            
            // Olive pieces
            cr.SetSourceRGBA(0.15, 0.15, 0.15, 1);  // Black olives
            cr.Arc(x - size * 0.3, y - size * 0.3, size * 0.07, 0, 2 * Math.PI);
            cr.Fill();
            cr.Arc(x + size * 0.35, y + size * 0.4, size * 0.06, 0, 2 * Math.PI);
            cr.Fill();
            
            // Highlight/shine on pizza
            cr.SetSourceRGBA(1, 1, 1, 0.15);
            cr.Arc(x - size * 0.3, y - size * 0.3, size * 0.4, 0, 2 * Math.PI);
            cr.Fill();
        }

        static void CreateWidgetUI(string scriptFile)
        {
            if (mainWindow == null) return;
            
            VBox mainBox = new VBox(false, 0);
            mainWindow.Add(mainBox);
            
            // Create menu bar
            List<string> menuNames = new List<string>();
            string[] lines = File.ReadAllLines(scriptFile);
            foreach (string line in lines)
            {
                if (line.Trim().StartsWith("MENU|"))
                {
                    string[] parts = line.Trim().Split('|');
                    if (parts.Length > 1) menuNames.Add(parts[1]);
                }
            }
            
            if (menuNames.Count > 0)
            {
                MenuBar menuBar = new MenuBar();
                foreach (string name in menuNames)
                {
                    MenuItem menuItem = new MenuItem(name);
                    Menu subMenu = new Menu();
                    subMenu.Append(new MenuItem($"New {name}"));
                    subMenu.Append(new MenuItem($"Open {name}"));
                    menuItem.Submenu = subMenu;
                    menuBar.Append(menuItem);
                }
                mainBox.PackStart(menuBar, false, false, 0);
            }
            
            // Create drawing area for shapes
            DrawingArea drawArea = new DrawingArea();
            drawArea.Drawn += OnDraw;
            mainBox.PackStart(drawArea, true, true, 0);
            
            // Create status bar
            foreach (string line in lines)
            {
                if (line.Trim().StartsWith("STATUSBAR|"))
                {
                    string[] parts = line.Trim().Split('|');
                    string text = parts.Length > 1 ? parts[1] : "Ready";
                    Statusbar statusBar = new Statusbar();
                    statusBar.Push(0, text);
                    mainBox.PackEnd(statusBar, false, false, 0);
                    break;
                }
            }
        }
    }
}
